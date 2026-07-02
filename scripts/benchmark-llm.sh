#!/usr/bin/env bash
# ============================================================================
# benchmark-llm.sh — Benchmark de LATENCE des fournisseurs LLM (perturbation J2)
# ----------------------------------------------------------------------------
# Mesure le temps de génération d'un quiz de 10 QCM (MÊME prompt, MÊME cours)
# sur N runs par fournisseur, puis calcule p50 et p95.
#
# Pourquoi p50/p95 et pas la moyenne ? La moyenne masque les pics. p50 = temps
# médian ressenti ; p95 = « pire cas réaliste » qu'un utilisateur sur 20 subit.
# C'est ce dernier qui tue l'UX (cf. Léa : « si ça plante/lente, je n'y reviens
# jamais »).
#
# Fournisseurs testés :
#   - ollama  : LLM LOCAL (souverain, gratuit) — défaut du kit. Lent sur CPU.
#   - groq    : cloud compatible OpenAI (LPU, ultra-rapide, free tier).
#   (Ajouter d'autres providers OpenAI-compatibles via la même mécanique.)
#
# Dépendances : bash, curl, awk, jq.  (jq : sudo apt install jq / brew install jq)
#
# Usage :
#   ./scripts/benchmark-llm.sh                  # 5 runs + 1 warmup, providers auto
#   RUNS=10 ./scripts/benchmark-llm.sh          # 10 runs mesurés
#   PROVIDERS="ollama" ./scripts/benchmark-llm.sh
#   GROQ_API_KEY=gsk_xxx ./scripts/benchmark-llm.sh
#
# Sortie : tableau récapitulatif à l'écran + fichier markdown collable dans l'ADR
#          (docs/adr/benchmark-results.md).
# ============================================================================

set -euo pipefail

# ---------------------------------------------------------------------------
# Paramètres (surchargeables par variables d'environnement)
# ---------------------------------------------------------------------------
RUNS="${RUNS:-5}"                 # nombre de runs MESURÉS par fournisseur
WARMUP="${WARMUP:-1}"             # runs de chauffe non mesurés (charge le modèle en RAM)
PROVIDERS="${PROVIDERS:-ollama groq}"

# Ollama (local)
OLLAMA_HOST="${OLLAMA_HOST:-http://localhost:11434}"
OLLAMA_MODEL="${OLLAMA_MODEL:-llama3.1:8b}"

# Groq (cloud, format OpenAI)
GROQ_API_KEY="${GROQ_API_KEY:-}"
GROQ_BASE="${GROQ_BASE:-https://api.groq.com/openai/v1}"
GROQ_MODEL="${GROQ_MODEL:-llama-3.3-70b-versatile}"

# Timeout par requête (s). Un 8B sur CPU peut dépasser 120 s (cf. J2).
REQ_TIMEOUT="${REQ_TIMEOUT:-600}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RESULTS_FILE="${RESULTS_FILE:-${SCRIPT_DIR}/../docs/adr/benchmark-results.md}"

# ---------------------------------------------------------------------------
# Vérification des dépendances
# ---------------------------------------------------------------------------
for bin in curl awk jq; do
    if ! command -v "$bin" >/dev/null 2>&1; then
        echo "❌ Dépendance manquante : '$bin'. Installez-la puis relancez." >&2
        exit 1
    fi
done

# ---------------------------------------------------------------------------
# Données de test : un cours réaliste (Communication non-verbale — cas Mme
# Lefèvre, BTS Communication). > 200 caractères, identique pour TOUS les runs.
# ---------------------------------------------------------------------------
TITLE="Communication non-verbale"
read -r -d '' SOURCE_TEXT <<'EOF' || true
La communication non-verbale désigne l'ensemble des signaux échangés sans recours
aux mots : posture, gestes, expressions faciales, regard, distance interpersonnelle
(proxémique) et intonation (paralangage). Selon les travaux d'Albert Mehrabian sur
les messages à charge émotionnelle, l'impact d'un message reposerait à 7 % sur les
mots, 38 % sur la voix et 55 % sur le langage corporel — un résultat souvent
sur-généralisé à tort à toute communication. La proxémique, théorisée par Edward T.
Hall, distingue quatre distances : intime, personnelle, sociale et publique. Les
micro-expressions, étudiées par Paul Ekman, révèlent des émotions fugaces (peur,
colère, dégoût, joie, tristesse, surprise, mépris) difficiles à dissimuler. En
contexte professionnel, la maîtrise du non-verbal renforce l'écoute active, la
gestion des conflits et la prise de parole en public.
EOF

# Prompt système (réplique de backend/llm/services/quiz_prompt.py — DRY si modifié là-bas)
read -r -d '' SYSTEM_PROMPT <<'EOF' || true
Tu es un assistant pédagogique francophone spécialisé en génération de QCM. À partir
du cours fourni, tu génères exactement 10 questions à choix multiples pour aider un
étudiant à réviser.

Règles ABSOLUES :
- Exactement 10 questions.
- Chaque question a EXACTEMENT 4 options.
- Une seule bonne réponse par question, indiquée par "correct_index" (0 à 3).
- Pas de markdown, pas de balises HTML, pas d'explications hors JSON.
- Sortie = JSON STRICT et UNIQUEMENT JSON.

Format de sortie :
{ "questions": [ {"prompt": "...", "options": ["...","...","...","..."], "correct_index": 0} ] }
EOF

USER_PROMPT="TITRE DU COURS : ${TITLE}

COURS :
${SOURCE_TEXT}

GÉNÈRE LE JSON MAINTENANT :"

FULL_PROMPT="${SYSTEM_PROMPT}

${USER_PROMPT}"

# ---------------------------------------------------------------------------
# Un appel = un POST. Renvoie le temps total (s) sur stdout, ou "FAIL".
# On utilise curl -w %{time_total} : mesure réseau + serveur, précise au ms.
# ---------------------------------------------------------------------------
call_ollama() {
    local body http t
    body="$(jq -n --arg m "$OLLAMA_MODEL" --arg p "$FULL_PROMPT" \
        '{model:$m, prompt:$p, stream:false, format:"json", options:{temperature:0.4}}')"
    # %{http_code} puis %{time_total}, séparés par un espace, en dernière ligne.
    read -r http t < <(curl -s -o /dev/null -m "$REQ_TIMEOUT" \
        -w '%{http_code} %{time_total}' \
        -H 'Content-Type: application/json' \
        -d "$body" \
        "${OLLAMA_HOST%/}/api/generate" || echo "000 0")
    if [ "$http" = "200" ]; then echo "$t"; else echo "FAIL($http)"; fi
}

call_groq() {
    local body http t
    body="$(jq -n --arg m "$GROQ_MODEL" --arg s "$SYSTEM_PROMPT" --arg u "$USER_PROMPT" \
        '{model:$m, temperature:0.4, response_format:{type:"json_object"},
          messages:[{role:"system",content:$s},{role:"user",content:$u}]}')"
    read -r http t < <(curl -s -o /dev/null -m "$REQ_TIMEOUT" \
        -w '%{http_code} %{time_total}' \
        -H 'Content-Type: application/json' \
        -H "Authorization: Bearer ${GROQ_API_KEY}" \
        -d "$body" \
        "${GROQ_BASE%/}/chat/completions" || echo "000 0")
    if [ "$http" = "200" ]; then echo "$t"; else echo "FAIL($http)"; fi
}

# ---------------------------------------------------------------------------
# Calcule p50, p95, min, max, moyenne (nearest-rank) à partir d'une liste de
# temps passée sur stdin (un par ligne). Renvoie : "p50 p95 min max mean n".
# ---------------------------------------------------------------------------
compute_stats() {
    sort -n | awk '
        { a[NR]=$1; sum+=$1 }
        END {
            n=NR
            if (n==0) { print "NA NA NA NA NA 0"; exit }
            # nearest-rank : rang = ceil(p * n)
            r50=int(0.50*n); if (0.50*n > r50) r50++; if (r50<1) r50=1
            r95=int(0.95*n); if (0.95*n > r95) r95++; if (r95<1) r95=1
            printf "%.2f %.2f %.2f %.2f %.2f %d\n", a[r50], a[r95], a[1], a[n], sum/n, n
        }'
}

# ---------------------------------------------------------------------------
# Boucle de benchmark pour un fournisseur donné.
# ---------------------------------------------------------------------------
declare -a MD_ROWS=()

bench_provider() {
    local provider="$1" call_fn="$2" model="$3"
    echo ""
    echo "==================================================================="
    echo "▶ Fournisseur : ${provider}  (modèle : ${model})"
    echo "==================================================================="

    # Warmup (non mesuré) — charge le modèle en mémoire pour Ollama.
    if [ "$WARMUP" -gt 0 ]; then
        for ((w=1; w<=WARMUP; w++)); do
            echo "   warmup ${w}/${WARMUP}..."
            "$call_fn" >/dev/null || true
        done
    fi

    local times=() fails=0 res
    for ((i=1; i<=RUNS; i++)); do
        res="$("$call_fn")"
        if [[ "$res" == FAIL* ]]; then
            echo "   run ${i}/${RUNS} : ❌ ${res}"
            fails=$((fails+1))
        else
            echo "   run ${i}/${RUNS} : ${res}s"
            times+=("$res")
        fi
    done

    if [ "${#times[@]}" -eq 0 ]; then
        echo "   ⚠ Aucun run réussi pour ${provider} (échecs : ${fails})."
        MD_ROWS+=("| ${provider} | ${model} | — | — | — | — | 0/${RUNS} |")
        return
    fi

    local stats p50 p95 mn mx mean n
    stats="$(printf '%s\n' "${times[@]}" | compute_stats)"
    read -r p50 p95 mn mx mean n <<<"$stats"
    echo "   -----------------------------------------------------------------"
    printf "   p50=%ss  p95=%ss  min=%ss  max=%ss  moy=%ss  (n=%s, échecs=%s)\n" \
        "$p50" "$p95" "$mn" "$mx" "$mean" "$n" "$fails"
    MD_ROWS+=("| ${provider} | ${model} | ${p50} | ${p95} | ${mn} | ${mx} | ${n}/${RUNS} |")
}

# ---------------------------------------------------------------------------
# Exécution
# ---------------------------------------------------------------------------
echo "==================================================================="
echo " BENCHMARK LLM — perturbation J2 (latence)"
echo " Runs mesurés : ${RUNS}  |  Warmup : ${WARMUP}  |  Timeout : ${REQ_TIMEOUT}s"
echo " Cours de test : « ${TITLE} »"
echo "==================================================================="

for p in $PROVIDERS; do
    case "$p" in
        ollama)
            if curl -s -m 3 "${OLLAMA_HOST%/}/api/tags" >/dev/null 2>&1; then
                bench_provider "ollama" call_ollama "$OLLAMA_MODEL"
            else
                echo ""
                echo "⏭  ollama ignoré : ${OLLAMA_HOST} injoignable (Ollama démarré ? modèle pull ?)."
            fi
            ;;
        groq)
            if [ -n "$GROQ_API_KEY" ]; then
                bench_provider "groq" call_groq "$GROQ_MODEL"
            else
                echo ""
                echo "⏭  groq ignoré : GROQ_API_KEY absente (clé gratuite : https://console.groq.com/keys)."
            fi
            ;;
        *)
            echo "⏭  fournisseur inconnu : ${p}"
            ;;
    esac
done

# ---------------------------------------------------------------------------
# Récapitulatif + écriture du fichier markdown (collable dans l'ADR)
# ---------------------------------------------------------------------------
echo ""
echo "==================================================================="
echo " RÉCAPITULATIF (secondes)"
echo "==================================================================="
HEADER="| Fournisseur | Modèle | p50 | p95 | min | max | réussis |"
SEP="|---|---|---|---|---|---|---|"
echo "$HEADER"; echo "$SEP"
for row in "${MD_ROWS[@]:-}"; do [ -n "$row" ] && echo "$row"; done

if [ "${#MD_ROWS[@]}" -gt 0 ]; then
    {
        echo "# Résultats benchmark LLM — perturbation J2"
        echo ""
        echo "> Généré par \`scripts/benchmark-llm.sh\` le $(date '+%Y-%m-%d %H:%M:%S')."
        echo "> Runs mesurés : ${RUNS} · warmup : ${WARMUP} · cours : « ${TITLE} »."
        echo "> Machine : $(uname -s -m 2>/dev/null || echo 'n/a'). Temps en secondes."
        echo ""
        echo "$HEADER"; echo "$SEP"
        for row in "${MD_ROWS[@]}"; do [ -n "$row" ] && echo "$row"; done
    } >"$RESULTS_FILE"
    echo ""
    echo "📄 Résultats écrits dans : ${RESULTS_FILE}"
fi

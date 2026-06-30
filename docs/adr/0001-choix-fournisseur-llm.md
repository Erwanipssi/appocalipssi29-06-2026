# ADR 0001 — Choix du fournisseur LLM pour la génération de quiz

| | |
|---|---|
| **Statut** | Proposé (à ratifier par le PO en revue de Sprint) |
| **Date** | 2026-06-30 (J2 — déverrouillage 14h) |
| **Décideurs** | Équipe 3 — Dillon AZAG, Youcef OULD KACI, Ahmed SADDIKI, Erwan MARCHAND, Steven JANSENS, Rayan Degane WAFO MBE, Nassim DEFLANDRE |
| **Perturbation** | J2 — Latence de génération (benchmark LLM) |
| **Feature impactée** | F3 — Génération automatique d'un quiz de 10 QCM |

---

## Contexte

La génération de quiz (F3) repose par défaut sur **Ollama en local** (`llama3.1:8b`),
choix structurant du produit : c'est notre **différenciateur n°1 — « RGPD, local-first »**
(cf. Product Vision Board §6.2) et un **prérequis non négociable** pour notre cible
**primaire enseignante** (Mme Lefèvre, Éducation nationale → aucune donnée hors UE,
cf. note de décision MoSCoW J1).

**Problème déclencheur (perturbation J2) :** sur une machine **CPU sans GPU**, une
génération `llama3.1:8b` prend couramment **2 à 5 minutes** (constat documenté jusque
dans le code du kit, `ollama_client.py` : timeout par défaut 600 s). Or nos deux
personas primaires posent une exigence de latence explicite :

- **Léa (étudiante)** : « si ça plante ou rame une fois en BU devant mes amies, je n'y
  reviens jamais » → décrochage identifié au Customer Journey à l'**étape 3** si la
  génération dépasse **~60 s**.
- **Mme Lefèvre (enseignante)** : onboarding self-service visé **< 5 min**.

Une latence p95 de plusieurs minutes est donc **incompatible avec l'UX cible**. Il faut
trancher, **benchmark à l'appui**, comment concilier *souveraineté des données* et
*latence acceptable*.

---

## Options envisagées

| # | Option | Souveraineté / RGPD | Latence attendue | Coût | Verdict |
|---|--------|---------------------|------------------|------|---------|
| **A** | **Ollama `llama3.1:8b` local, tel quel** | ✅ Totale (local) | ❌ p95 ~2-5 min sur CPU | ✅ Gratuit | UX inacceptable en l'état |
| **B** | **Ollama, mais modèle plus léger** (`phi3:mini` / `llama3.2:3b`) | ✅ Totale (local) | ⚠️ p95 nettement réduite (modèle 3-4×  plus petit) | ✅ Gratuit | Meilleur compromis souverain |
| **C** | **Bascule cloud Groq** (`llama-3.3-70b`, LPU) | ❌ Données hors serveur (enjeu J3-bis) | ✅ p95 quelques secondes | ✅ Free tier | Rapide mais casse le différenciateur RGPD |
| **D** | **Cloud payant** (OpenAI / Anthropic) | ❌ Hors UE | ✅ Rapide | ❌ Payant | Hors scope MVP (ADR séparée requise) |

> Les chiffres de latence sont à **confirmer par le benchmark** (`scripts/benchmark-llm.sh`,
> 5 runs, p50 + p95). Voir [benchmark-results.md](benchmark-results.md) une fois le script
> exécuté (Docker + Ollama démarrés, ou clé Groq fournie).

---

## Décision retenue

**On conserve Ollama en local comme fournisseur par défaut (souveraineté non
négociable), et on traite la latence par deux leviers techniques plutôt que par
l'abandon du local :**

1. **Modèle local plus léger par défaut** (option B) : passer de `llama3.1:8b` à
   un modèle plus rapide (`phi3:mini` ou `llama3.2:3b`) **si le benchmark confirme**
   un gain de latence significatif **sans** dégradation inacceptable de la qualité des
   QCM (validation déjà en place dans `quiz_prompt.py`).
2. **Génération asynchrone + feedback de progression** côté UX : la génération ne
   bloque plus l'utilisateur sur une page figée ; barre/indicateur de progression
   (lève le décrochage « étape 3 » du Customer Journey).

**Groq (cloud, free tier) reste branchable en fallback opt-in** — déjà supporté par
la factory (`LLM_BACKEND=groq`) — **mais n'est PAS le défaut** : réservé aux
démonstrations ou contextes explicitement non sensibles, avec mention RGPD claire
(le garde-fou existe déjà : `factory.py` loggue un avertissement sur tout backend cloud).

Le choix du **fournisseur reste piloté par configuration** (`.env` / admin) grâce à
l'abstraction `LLMClient` existante : aucune réécriture, la décision est **réversible**.

---

## Justification

- **Cohérence produit** : abandonner le local contredirait notre différenciateur n°1
  et notre cible primaire (Éducation nationale). La souveraineté prime, on optimise
  *à l'intérieur* de cette contrainte.
- **Le vrai goulot est le modèle + l'UX bloquante**, pas le principe du local : un
  modèle 3B et une génération asynchrone adressent la latence ressentie sans envoyer
  les cours d'élèves dans le cloud.
- **Décision défendable et chiffrée** : tranchée sur p50/p95 mesurés, pas sur une
  impression. p95 retenu comme critère car c'est lui qui matérialise le décrochage UX.
- **Réversibilité** : l'architecture multi-fournisseurs (8 backends, factory pattern)
  permet de re-basculer en une variable d'environnement si le contexte change.

---

## Conséquences

**Positives**
- UX de génération compatible avec les attentes des 2 personas primaires.
- Différenciateur RGPD / local-first préservé pour la soutenance et la cible B2B éducation.
- Aucune dépendance payante ni clé externe requise pour le MVP.

**Négatives / risques**
- Un modèle local plus léger peut **dégrader la qualité** des QCM → à surveiller via la
  perturbation **J4 (erreurs factuelles)** et la validation stricte existante.
- La génération asynchrone ajoute de la **complexité** (état « en cours », polling/poll-free) → coût Sprint à intégrer.
- Les chiffres doivent être **re-mesurés sur la machine de démo** (la latence dépend
  fortement du CPU).

**Suivi / re-estimation du Sprint Backlog (étape 5 du process J2)**
- [ ] Exécuter `scripts/benchmark-llm.sh` sur la machine de démo et coller les chiffres
      dans `benchmark-results.md` (avant mer. 09h).
- [ ] Tâche : `pull` du modèle léger + bascule `OLLAMA_MODEL` par défaut (~1 SP).
- [ ] Tâche : génération asynchrone F3 + indicateur de progression front (~3-5 SP, à
      arbitrer vs scope MVP de mercredi 17h45).
- [ ] Documenter le fallback Groq opt-in dans le README (~0.5 SP).

---

## Reproduire le benchmark

```bash
# Local (Ollama démarré + modèle pull) :
docker compose up -d
make pull-model            # ou : OLLAMA_MODEL=phi3:mini ./scripts/...  pour tester un modèle léger
./scripts/benchmark-llm.sh

# Comparer un fournisseur cloud (clé gratuite) :
GROQ_API_KEY=gsk_xxx ./scripts/benchmark-llm.sh

# Plus de runs / un seul fournisseur :
RUNS=10 PROVIDERS="ollama" ./scripts/benchmark-llm.sh
```

Le script écrit un tableau p50/p95 dans `docs/adr/benchmark-results.md`, à référencer
ci-dessus dans « Options envisagées ».

# Note de décision MoSCoW — Perturbation J1 : Mme Sophie Lefèvre (persona primaire)

**Équipe :** Équipe 3 — Dillon AZAG, Youcef OULD KACI, Ahmed SADDIKI, Erwan MARCHAND, Steven JANSENS, Rayan Degane WAFO MBE, Nassim DEFLANDRE
**Date :** Lundi 29/06/2026 — 14h00
**Décision PO :** Mme Lefèvre est confirmée comme cible **PRIMAIRE**, au même titre que Léa Martin.

---

## 1. Contexte officiel (amorce fournie par le PO)

Mme Sophie Lefèvre, 42 ans, professeure de Communication en BTS dans un lycée privé sous contrat à Lyon (établissement Lyon 6ᵉ). Elle gère une classe de **28 étudiants** en BTS Communication 1ʳᵉ année. Sa charge réelle : 6h de cours/semaine + ~3h de préparation + ~3h de correction = **12h/semaine** consacrées à la pédagogie hors temps de classe, soit environ **12h/mois rien que pour la correction**.

Elle découvre EduTutor IA via un article du Café Pédagogique, et passe par un parcours d'évaluation prudent avant adoption : elle ne fait pas confiance par défaut à un outil IA générique, contrairement à un public grand public.

Après discussion avec le Product Owner en séance de cadrage, l'équipe a tranché : **EduTutor IA est un produit dual-usage**, avec deux cibles primaires actives dès le MVP — l'étudiant·e en révision (Léa) et l'enseignant·e en préparation d'évaluation (Mme Lefèvre).

---

## 2. Analyse de l'impact sur le scope

| Besoin identifié (Mme Lefèvre) | Feature concernée | Disponible au MVP ? |
|---|---|---|
| Uploader un cours (ex. Communication non-verbale) et générer un quiz | F2 + F3 | ✅ Oui |
| Vérifier la fiabilité des questions avant diffusion à 28 étudiants | Hors scope MVP | ❌ Non — Release 2 |
| Exporter le quiz en PDF pour distribution papier en classe | Hors scope MVP | ❌ Non — Release 2 |
| Adapter automatiquement le niveau de difficulté à la classe | Hors scope MVP | ❌ Non — Release 2 |
| RGPD strict (Éducation Nationale, aucune donnée hors UE) | Ollama local | ✅ Déjà couvert par l'architecture |

### Conclusion clé
**Mme Lefèvre bénéficie déjà du cœur du MVP sans développement supplémentaire.** F2 (upload de cours) et F3 (génération de quiz via Llama 3.1 8B local) répondent directement à son besoin n°1 : réduire le temps de préparation (objectif chiffré : gagner au moins 1h/semaine sur ses 12h actuelles). Les fonctionnalités de confort spécifiques au métier d'enseignant (review, export, adaptation de niveau) relèvent de la Release 2.

---

## 3. Décision MoSCoW

### MUST (Release 1 — inchangé)
> **Aucune story Must ajoutée.** Les 6 features F1–F6 du MVP restent le périmètre non négociable. Mme Lefèvre est servie par l'existant (F1 inscription, F2 upload, F3 génération, F6 historique). Deadline mercredi 17h45 (fin Sprint 5) préservée.

### SHOULD (Release 2 — nouvelles stories, intégrées au Product Backlog officiel)

**US-MME-01** — *En tant qu'enseignante, je veux relire et corriger les questions générées avant de les utiliser en classe, afin de garantir leur exactitude pédagogique devant mes 28 étudiants.*
- Given/When/Then : un quiz généré pour un cours uploadé par l'enseignante → elle accède à l'interface de review question par question → chaque question peut être validée/modifiée/supprimée avant export.
- 5 SP — Sprint 7 (jeudi PM).

**US-MME-02** — *En tant qu'enseignante, je veux exporter mon quiz en PDF mis en page, afin de le distribuer directement à mes élèves en classe.*
- Given/When/Then : un quiz validé → clic sur "Exporter PDF" → PDF généré avec titre, matière, date, questions numérotées.
- 3 SP — Sprint 7 (jeudi PM).

### COULD (Release 2+ — si capacité disponible)

**US-MME-03** — *En tant qu'enseignante, je veux organiser mes quiz par matière et par classe, afin de les retrouver facilement d'une année sur l'autre.*
- 3 SP — dépend de la vélocité réelle des Sprints 6-7.

### WON'T (hors scope semaine)
- Adaptation automatique du niveau de difficulté à la classe (nécessite calibrage pédagogique avancé, hors capacité semaine).
- Mode multi-établissement / partage entre enseignant·es.
- Dashboard de ROI exportable pour la direction (lié au cycle B2B établissement, non activé pour ce MVP).

---

## 4. Impact sur les artefacts déjà livrés

| Artefact officiel | Mise à jour réalisée |
|---|---|
| `equipe-03-persona-v1.0.docx` | Mme Lefèvre intégrée comme persona 2, statut **primaire**, infos officielles (42 ans, BTS Communication, Lyon, 28 étudiants, 12h/mois correction) |
| `equipe-03-customer-journey-v1.0.docx` | Parcours enseignant complet (5 étapes), moment de décrochage identifié à l'étape 2 (délai réponse > 24h) |
| `equipe-03-product-vision-board-v1.1.docx` | Vision et différenciateurs reformulés pour refléter le dual-usage étudiant/enseignant |
| `equipe-03-product-backlog-v1.1.xlsx` | US-MME-01, US-MME-02, US-MME-03 ajoutées (23 stories au total, 135 SP) |
| `equipe-03-story-map-v1.0.xlsx` | Stories Mme Lefèvre taguées et placées dans les bonnes colonnes (Générer un quiz / Consulter résultats / Uploader un cours) |

---

## 5. Point de vigilance produit (issu du Customer Journey)

D'après le parcours détaillé de Mme Lefèvre, le moment de décrochage potentiel est identifié à l'**étape 2 (Inscription)** : si le délai de réponse à une demande de compte enseignant dépasse 24h, elle risque d'abandonner ("Si 48h pour répondre, j'irai voir ailleurs"). Ce point devra être tranché en priorité produit avant l'activation commerciale de la cible enseignante, même s'il ne bloque pas le MVP technique.

---

## 6. Conclusion

L'arrivée de Mme Lefèvre comme persona primaire est une **clarification du positionnement produit, pas une extension de scope risquée**. Le MVP F1-F6 reste inchangé et suffit à démontrer la valeur pour les deux cibles. Les 3 stories spécifiques enseignante sont cadrées en Release 2, avec un total de 11 SP supplémentaires (5+3+3) sur les 135 SP du backlog complet — un ajout maîtrisé qui ne menace pas la trajectoire de la semaine.

> *« Deux personas primaires, un seul MVP. La polyvalence du produit est la réponse, pas une complexité supplémentaire. »*

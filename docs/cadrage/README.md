# 📋 Artefacts de cadrage — EduTutor IA (J1, lundi 29/06/2026)

Les 7 artefacts agiles produits le lundi matin avant 13h, dans l'ordre du parcours de cadrage.

| # | Artefact | Fichier | Contenu |
|---|----------|---------|---------|
| 1 | Product Vision Board | `01-product-vision-board.docx` | Vision, 2 cibles (étudiant + enseignant), 3 features différenciantes, objectifs business |
| 2 | Fiches Personas | `02-personas.docx` | 3 personas PRIMAIRES : Léa, Maxime (étudiants) + Mme Lefèvre (enseignante, ajoutée J1) |
| 3 | Customer Journey Map | `03-customer-journey.docx` | 5 étapes : actions, pensées, émotions, frictions (persona Léa) |
| 4 | Story Map | `04-story-map.xlsx` | Vue 2D : parcours en colonnes, MVP (MUST) en haut, Release 2 en bas |
| 5 | Release Planning | `05-release-planning.xlsx` | 8 sprints demi-journée, MVP au S5 (mer. 17h45), Release 2 au S7 (jeu. 17h45) |
| 6 | Product Backlog | `06-product-backlog.xlsx` | 15 user stories INVEST + MoSCoW + onglet DoR/DoD |
| 7 | Sprint Backlog S1 | `07-sprint-backlog-s1.xlsx` | 8 tâches, 15h engagées / 25h capacité (60%), statuts Done/En cours/À faire |

## ✅ Couverture spec

- **MVP F1–F6** → US1 à US6 (toutes en `Must`)
- **CA1–CA8** → référencés dans les critères d'acceptation du backlog
- **T1–T7** → US7 (Docker/PostgreSQL) et US8 (repo public + CI)
- **RGPD / souveraineté** → Ollama local, porté par la Vision Board + US9

## 📌 Perturbation J1 — Mme Lefèvre (confirmée primaire)

- Cible enseignante confirmée **primaire** par le PO en séance (lundi 14h)
- EduTutor IA = dual-usage : étudiant·e en révision + enseignant·e en création d'évaluation
- **0 story Must ajoutée** — MVP F1–F6 inchangé, deadline mercredi 17h45 maintenue
- 3 stories ajoutées en Release 2 (Should/Could) → voir `/docs/perturbations/j1/`

## 👥 Équipe

Dillon AZAG · Nassim DEFLANDRE · Steven JANSEN · Rayan WAFO MBE · Erwan MARCHAND

## 📌 Convention de commits

Conventional Commits — répartis sur tous les membres (≥ 3 commits significatifs/membre — CA8).

```
feat: nouvelle fonctionnalité
fix: correction de bug
docs: ajout ou mise à jour de documentation
test: ajout de tests
chore: tâche technique (CI, config, etc.)
```

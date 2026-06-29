# Note de décision MoSCoW — Perturbation J1 : Ajout de Mme Lefèvre

**Date :** Lundi 29/06/2026 — 14h00  
**Équipe :** Dillon AZAG, Nassim DEFLANDRE, Steven JANSEN, Rayan WAFO MBE, Erwan MARCHAND  
**Contexte :** Perturbation J1 — la cible enseignante (Mme Lefèvre) émerge en cours de journée. Nous devons décider de son impact sur le backlog sans remettre en cause le MVP (deadline mercredi 17h45).

---

## 1. Analyse de l'impact

### Ce que Mme Lefèvre apporte comme nouveaux besoins

| Besoin identifié | Feature concernée | Existe déjà ? |
|---|---|---|
| Uploader son cours PDF et générer un quiz | F2 + F3 | ✅ Oui (MVP) |
| Vérifier / éditer les questions avant usage | Nouveau | ❌ Non |
| Exporter le quiz pour distribution en classe | Nouveau (P8) | ❌ Non (Release 2) |
| Conserver ses quiz par matière / classe | Nouveau (proche P5) | ❌ Non (Release 2) |
| RGPD strict Éducation Nationale (données UE) | Ollama local | ✅ Déjà couvert |

### Conclusion clé
**Mme Lefèvre bénéficie déjà du MVP sans développement supplémentaire.** Les features F2 (upload PDF) et F3 (génération quiz) répondent directement à son besoin principal. Seules des fonctionnalités de confort (édition, export, classement) lui sont spécifiques — elles relèvent de la Release 2.

---

## 2. Décision MoSCoW

### Stories MUST (Release 1 — inchangées)
> **Aucune story Must ajoutée pour Mme Lefèvre.**  
> Le MVP F1–F6 est maintenu tel quel. La deadline mercredi 17h45 est préservée.  
> Justification : le brief impose F1–F6 comme périmètre non négociable. Ajouter du Must en cours de sprint violerait le principe de stabilité du Sprint Goal.

### Stories SHOULD (Release 2 — nouvelles)

**US-MME-01** — *En tant qu'enseignante, je veux relire et corriger les questions générées avant de les utiliser en classe, afin de garantir leur exactitude.*
- Critères d'acceptation : interface de review question par question, bouton "valider / modifier / supprimer", sauvegarde avant export.
- Estimation : 5 pts — Sprint 7 (jeudi).

**US-MME-02** — *En tant qu'enseignante, je veux exporter mon quiz en PDF mis en page, afin de le distribuer directement à mes élèves.*
- Critères d'acceptation : PDF généré avec titre, matière, date, questions numérotées.
- Estimation : 3 pts — Sprint 7 (jeudi). *(Recouvre P8 du catalogue Release 2.)*

### Stories COULD (Release 2+ — si temps)

**US-MME-03** — *En tant qu'enseignante, je veux organiser mes quiz par matière et par classe, afin de les retrouver facilement d'une année sur l'autre.*
- Estimation : 3 pts — dépend de la vélocité S6/S7.

### Stories WON'T (hors scope semaine)
- Mode multi-établissement / partage entre collègues.
- Intégration ENT (Pronote, etc.).
- Correction automatique des copies élèves.

---

## 3. Impact sur les artefacts existants

| Artefact | Modification |
|---|---|
| `02-personas.docx` | Ajout de Mme Lefèvre comme 3e persona (fichier mis à jour) |
| `06-product-backlog.xlsx` | Ajout US-MME-01, US-MME-02, US-MME-03 (Should/Could) |
| `07-sprint-backlog-s1.xlsx` | Aucun impact — S1 en cours, stories Mme Lefèvre → S7 |
| `04-story-map.xlsx` | Bande SHOULD mise à jour avec US-MME-01 et US-MME-02 |

---

## 4. Négociation avec le Product Owner

**Questions posées au PO :**
1. Mme Lefèvre est-elle une cible B2B (établissement qui souscrit) ou B2C (enseignante à titre personnel) ?
2. La feature de review/édition des questions est-elle bloquante pour un premier pilote avec elle ?
3. Prioriser US-MME-01 ou US-MME-02 en Release 2 si on n'a le temps que pour une ?

**Réponses / arbitrages PO :** *(à compléter lors de la session avec l'animateur)*

---

## 5. Conclusion

L'ajout de Mme Lefèvre est une **opportunité produit, pas une menace planning**. Le MVP reste intact. Deux stories Should sont ajoutées au backlog Release 2 (US-MME-01 export + US-MME-02 review) et seront arbitrées avec le PO jeudi matin selon la vélocité réelle de l'équipe.

> *« Ne pas réécrire ce qui existe. Réajuster la trajectoire sans perdre le cap. »*

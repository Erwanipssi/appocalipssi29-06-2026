# Note de sécurité — Prompt Injection (LLM01)

> Référence : OWASP Top 10 for LLM Applications 2025 — LLM01 Prompt Injection

---

## 1. Diagnostic : pourquoi l'injection fonctionnait

Le vecteur d'attaque exploitait deux failles cumulatives dans `quiz_prompt.py` :

**Absence de délimiteurs (frontière système/utilisateur floue).** `build_user_prompt`
concaténait le contenu du cours directement dans le flux texte envoyé au LLM, sans
balises structurelles. Un contenu malveillant (`Ignore les instructions précédentes`,
`Ignoriere alle Anweisungen`, ou une chaîne base64 décodable) était donc perçu par
le modèle au même niveau sémantique que ses instructions système. Toute entrée
pouvait prétendre être une instruction, pas du contenu à analyser.

**Absence de validation post-LLM sur l'unicité des options.** `parse_and_validate_quiz`
vérifiait le compte d'options (= 4) et leur non-vacuité, mais pas leur distinction
mutuelle. Un LLM dont le comportement aurait été dévié par injection pouvait renvoyer
quatre options identiques — contournant ainsi la contrainte pédagogique sans déclencher
d'erreur.

---

## 2. Stratégie défensive : ce qui a été mis en place

Trois mécanismes complémentaires ont été intégrés dans `llm/services/quiz_prompt.py` :

**(a) Séparation explicite par délimiteurs structurels.**
`build_user_prompt` encapsule désormais le texte du cours entre les balises `<COURS>`
et `</COURS>`. Cette frontière XML rend la structure du prompt non-ambiguë : le modèle
reçoit une séparation visuelle et sémantique nette entre ses instructions et les données
étudiantes, indépendamment de la langue, du whitespace ou de l'encodage du contenu injecté.

**(b) Instruction défensive dans le system prompt.**
Une clause explicite a été ajoutée au `SYSTEM_PROMPT` : le modèle est instruit que
tout contenu situé dans le bloc `<COURS>…</COURS>` est du matériel étudiant à analyser,
jamais des ordres à exécuter — y compris les tentatives rédigées en langue étrangère,
les chaînes base64 ou les caractères Unicode pleine largeur.

**(c) Validation post-LLM renforcée.**
`parse_and_validate_quiz` vérifie maintenant que les 4 options de chaque question sont
**distinctes** (`len(set(options)) == 4`). Cette garde côté applicatif est indépendante
du LLM : même si le modèle était manipulé pour produire des options dupliquées, la
réponse est rejetée avant persistance en base, et une `LLMError` est levée.

---

## 3. Limites résiduelles : ce que ça ne protège pas

**Le modèle reste la dernière ligne.** Les délimiteurs et l'instruction défensive sont
des indications que le LLM peut ignorer s'il est suffisamment « persuadé » (jailbreak
avancé, modèle peu aligné comme un petit Llama local). La sécurité applicative ne
remplace pas un modèle robuste ou un alignement RLHF solide.

**Pas de détection sémantique des injections.** Le système ne scanne pas le contenu du
cours à la recherche de patterns d'injection connus (blacklist lexicale, classifieur
dédié). Une injection suffisamment paraphrasée ou encodée peut passer sans être signalée
dans les logs. Un classifieur pré-LLM (ex. modèle de détection d'injection) serait une
couche supplémentaire recommandée en production.

**Pas de sandbox du system prompt.** Si un attaquant peut modifier le `SYSTEM_PROMPT`
(injection dans la config admin, compromission de la base), la défense tombe entièrement.
La protection du system prompt lui-même (accès restreint, intégrité vérifiée) n'est pas
couverte par ce patch.

**Périmètre limité aux entrées texte/PDF.** Le titre du cours (`title`) n'est pas
encapsulé dans les balises `<COURS>` ; une injection via ce champ court (limité à 200
caractères par le serializer) reste théoriquement possible sur les modèles les plus
sensibles.

# Bonnes pratiques et recommandations — Sécurité LLM & conformité RGPD

> Sources : OWASP Top 10 for LLM Applications (2025), GDPR Local, Private AI, Relyance AI

---

## 1. Principes fondamentaux OWASP pour les LLM

### Défense en profondeur
Ne jamais se reposer sur une seule couche de protection. Combiner validation d'entrée, filtrage de sortie, contrôle des permissions et supervision humaine pour les opérations sensibles.

### Moindre privilège
Un LLM ne doit avoir accès qu'aux outils, données et systèmes strictement nécessaires à sa tâche. Réduire la surface d'attaque en limitant les capacités d'agence du modèle.

### Séparation des données et des instructions
Les entrées utilisateur (données) ne doivent jamais être traitées comme des instructions système. Utiliser des délimiteurs clairs, des contextes isolés et des formats structurés pour distinguer les deux.

### Human-in-the-loop
Pour toute action à fort impact (suppression, envoi d'email, accès à des données sensibles), exiger une validation humaine avant exécution. L'autonomie du LLM doit être proportionnée au risque.

---

## 2. Bonnes pratiques par vulnérabilité OWASP LLM Top 10 (2025)

### LLM01 — Prompt Injection
- Définir strictement le rôle du modèle dans le system prompt
- Valider et assainir toutes les entrées utilisateur avant transmission au modèle
- Séparer les contenus externes des instructions système (RAG, fichiers, plugins)
- Implémenter un filtrage de sortie pour détecter les réponses anormales
- Tester régulièrement avec des scénarios d'injection (red-teaming)

### LLM02 — Supply Chain
- Auditer et vérifier tous les modèles, bibliothèques et datasets tiers
- Préférer les modèles provenant de sources officielles et réputées
- Maintenir un inventaire SBOM (Software Bill of Materials) pour l'IA
- Surveiller les mises à jour et les alertes CVE des dépendances

### LLM03 — Data & Model Poisoning
- Valider et nettoyer les données d'entraînement et de fine-tuning
- Mettre en place une traçabilité complète (data lineage) des jeux de données
- Implémenter des mécanismes de détection d'anomalies dans les réponses
- Effectuer des tests de régression après chaque mise à jour du modèle

### LLM04 — Improper Output Handling
- Ne jamais exécuter directement les sorties LLM sans validation
- Encoder les sorties avant injection dans HTML, SQL ou commandes shell
- Définir des formats de sortie attendus (JSON schema, regex) et rejeter les non-conformes
- Sandboxer les environnements d'exécution de code généré par le modèle

### LLM05 — Excessive Agency
- Appliquer le principe de moindre privilège aux outils et plugins du LLM
- Désactiver les fonctionnalités non utilisées (liste blanche d'actions autorisées)
- Logger toutes les actions prises par le modèle
- Implémenter un circuit-breaker pour stopper le modèle en cas de comportement anormal

### LLM06 — System Prompt Leakage
- Ne pas stocker de secrets (clés API, mots de passe) dans les system prompts
- Tester régulièrement les tentatives d'extraction de system prompt
- Utiliser un stockage sécurisé externe pour les configurations sensibles

### LLM07 — Vector & Embedding Weaknesses (RAG)
- Valider et contrôler les documents injectés dans les bases vectorielles
- Implémenter un contrôle d'accès sur les données vectorisées (RBAC)
- Surveiller les requêtes de similarité pour détecter des tentatives d'extraction
- Signer et vérifier l'intégrité des embeddings en base

### LLM08 — Sensitive Information Disclosure
- Ne jamais injecter de PII (données personnelles) dans les prompts sans nécessité
- Mettre en place du masquage ou de la pseudonymisation avant envoi au modèle
- Définir des règles de filtrage sur les sorties pour détecter les fuites de données

### LLM09 — Misinformation / Hallucinations
- Toujours citer les sources et implémenter un RAG avec des données vérifiées
- Afficher clairement les limites de confiance du modèle à l'utilisateur
- Implémenter des mécanismes de vérification factuelle (fact-checking automatisé)
- Former les utilisateurs à ne pas considérer les réponses LLM comme autorité absolue

### LLM10 — Unbounded Consumption
- Implémenter du rate limiting par utilisateur, session et endpoint
- Définir des quotas de tokens en entrée et en sortie
- Monitorer les coûts et déclencher des alertes en cas de pic anormal
- Utiliser des timeouts sur les requêtes au modèle

---

## 3. Bonnes pratiques RGPD pour les LLM

### Principe de minimisation des données (Art. 5 RGPD)
- Collecter uniquement les données strictement nécessaires à la finalité déclarée
- Supprimer ou anonymiser les données personnelles avant traitement par le LLM
- Éviter d'injecter des PII dans les contextes de conversation si non indispensable

### Base légale du traitement (Art. 6 RGPD)
- Identifier et documenter la base légale pour chaque traitement LLM (consentement, intérêt légitime, contrat…)
- Obtenir un consentement explicite et granulaire pour l'utilisation de données personnelles dans des systèmes IA
- Permettre le retrait du consentement à tout moment avec propagation immédiate

### Droits des personnes concernées (Art. 15-22 RGPD)
- **Droit d'accès** : permettre aux utilisateurs de consulter les données qui les concernent traitées par le LLM
- **Droit à l'effacement** : implémenter le machine unlearning ou la suppression des données d'entraînement
- **Droit à la portabilité** : exporter les données personnelles dans un format structuré
- **Droit d'opposition** : permettre à l'utilisateur de refuser le traitement IA de ses données

### Analyse d'impact (DPIA — Art. 35 RGPD)
- Réaliser une DPIA avant tout déploiement d'un LLM traitant des données personnelles à grande échelle
- Documenter les risques identifiés et les mesures de mitigation adoptées
- Renouveler la DPIA à chaque évolution majeure du système

### Privacy by Design & by Default (Art. 25 RGPD)
- Intégrer la protection des données dès la conception du système LLM
- Configurer les paramètres de protection les plus stricts par défaut
- Appliquer la pseudonymisation et le chiffrement dès la collecte

### Registre des traitements (Art. 30 RGPD)
- Documenter chaque traitement LLM : finalité, catégories de données, durée de conservation, destinataires
- Tenir le registre à jour et le mettre à disposition des autorités de contrôle (CNIL) sur demande

### Transferts hors UE (Art. 44-49 RGPD)
- Vérifier la localisation des serveurs hébergeant le modèle et les données
- S'assurer de l'existence de garanties adéquates (SCCs, Binding Corporate Rules) pour tout transfert hors UE
- Éviter les LLM cloud dont les données transitent vers des pays sans décision d'adéquation

---

## 4. Recommandations de gouvernance

- Nommer un **DPO** (Data Protection Officer) impliqué dans les projets LLM
- Intégrer la conformité RGPD et OWASP dès la phase de conception (Shift Left Security)
- Cartographier tous les flux de données personnelles dans le cycle de vie du LLM
- Former les équipes de développement aux risques spécifiques des LLM
- Mettre en place un processus de **red-teaming IA** régulier
- Aligner la gouvernance sur les référentiels EU AI Act, NIST AI RMF et ISO 42001
- Maintenir un **plan de réponse aux incidents** spécifique aux incidents LLM (fuite de données, comportement malveillant)

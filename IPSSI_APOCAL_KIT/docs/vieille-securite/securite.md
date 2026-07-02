# Sécurités à mettre en place pour un LLM

> Référence : OWASP Top 10 for LLM Applications 2025, NIST AI RMF, EU AI Act

---

## 1. Sécurité des entrées (Input Security)

### Validation et assainissement
- Valider le type, la longueur et le format de toutes les entrées utilisateur
- Rejeter ou neutraliser les entrées contenant des patterns d'injection connus (`ignore previous instructions`, `jailbreak`, etc.)
- Limiter la taille maximale des prompts (token limit en entrée)
- Encoder les entrées pour éviter les injections de caractères spéciaux

### Détection de prompt injection
- Mettre en place un classifieur de détection d'injection avant envoi au modèle
- Utiliser une couche de prétraitement qui isole le contenu utilisateur des instructions système
- Logger toutes les tentatives d'injection détectées pour analyse forensique
- Blacklister les patterns connus d'attaque (few-shot hijacking, role-playing attacks)

### Séparation des contextes
- Utiliser des délimiteurs structurés clairs entre instructions système et données utilisateur
- Ne jamais concaténer directement les entrées utilisateur dans le system prompt
- Isoler les contenus issus de sources externes (RAG, fichiers uploadés, résultats web)

---

## 2. Sécurité des sorties (Output Security)

### Validation et filtrage
- Implémenter un filtre de sortie (output guard) avant restitution à l'utilisateur
- Détecter et bloquer les fuites de données personnelles (PII) dans les réponses
- Vérifier que les sorties respectent les formats attendus (JSON schema, longueur max)
- Encoder les sorties avant injection dans du HTML, SQL, commandes shell ou code

### Content moderation
- Intégrer un modèle de modération de contenu (ex. OpenAI Moderation API, Perspective API)
- Filtrer les contenus dangereux : instructions malveillantes, données sensibles, désinformation
- Logguer et alerter sur les sorties filtrées pour revue humaine

### Sandboxing du code généré
- Exécuter le code produit par le LLM dans un sandbox isolé (container, VM)
- Appliquer des restrictions système (no network, no file system) dans le sandbox
- Timeout et kill automatique des exécutions dépassant le seuil défini
- Ne jamais exécuter du code LLM avec des privilèges élevés (root/admin)

---

## 3. Contrôle d'accès et authentification

### Authentification
- Protéger tous les endpoints LLM par authentification forte (OAuth2, JWT, API keys)
- Implémenter du MFA (Multi-Factor Authentication) pour les accès administrateurs
- Rotation automatique et révocation des clés API
- Ne jamais exposer de clés API dans les logs, les system prompts ou le code source

### Autorisation (RBAC / ABAC)
- Définir des rôles stricts : utilisateur, opérateur, administrateur
- Appliquer le principe de moindre privilège : chaque rôle n'accède qu'aux fonctionnalités nécessaires
- Contrôler l'accès aux outils et plugins du LLM par rôle
- Auditer régulièrement les droits accordés

### Gestion des sessions
- Expirer les sessions LLM après une période d'inactivité
- Invalider les sessions côté serveur lors de la déconnexion
- Limiter le nombre de sessions concurrentes par utilisateur

---

## 4. Protection des données

### Chiffrement
- Chiffrer les données en transit avec TLS 1.3 minimum
- Chiffrer les données au repos (AES-256 pour les bases vectorielles, les logs, les historiques)
- Chiffrer les backups et les exports de données
- Utiliser des secrets managers (HashiCorp Vault, AWS Secrets Manager) pour les credentials

### Minimisation et anonymisation
- Pseudonymiser ou anonymiser les données personnelles avant envoi au LLM
- Remplacer les PII par des tokens via des techniques de tokenisation réversible
- Supprimer automatiquement les données personnelles des logs après X jours
- Implémenter du differential privacy lors du fine-tuning sur données personnelles

### Gestion du cycle de vie des données
- Définir des durées de rétention explicites pour chaque type de donnée
- Automatiser la suppression des données arrivant à expiration
- Implémenter le droit à l'effacement (machine unlearning ou purge des données d'entraînement)
- Maintenir un registre des traitements de données (conformité RGPD Art. 30)

---

## 5. Sécurité de l'infrastructure

### Isolation réseau
- Déployer le LLM dans un réseau privé (VPC) sans exposition directe à internet
- Utiliser un API Gateway comme unique point d'entrée (WAF, rate limiting, DDoS protection)
- Filtrer le trafic sortant du modèle (egress filtering) pour éviter l'exfiltration de données
- Segmenter le réseau : LLM, base vectorielle, orchestrateur, base de données dans des zones distinctes

### Sécurité des containers et de l'orchestration
- Scanner les images Docker pour les vulnérabilités (Trivy, Snyk) avant déploiement
- Exécuter les containers en mode non-root (rootless containers)
- Appliquer des security policies Kubernetes (Pod Security Standards, OPA/Gatekeeper)
- Mettre à jour régulièrement les images de base et les dépendances

### Supply chain security
- Vérifier la provenance et l'intégrité des modèles téléchargés (hash SHA256, signatures)
- Maintenir un SBOM (Software Bill of Materials) pour le stack IA
- Auditer les plugins et extensions LLM tiers avant intégration
- Utiliser uniquement des dépôts de modèles de confiance (Hugging Face verified, registres internes)

---

## 6. Monitoring et détection

### Logging
- Logger toutes les requêtes et réponses LLM avec horodatage et identifiant de session
- Logger les tentatives d'injection, les erreurs d'authentification et les anomalies de comportement
- Centraliser les logs dans un SIEM (Splunk, Elastic, Datadog)
- Protéger les logs contre la modification (write-once storage, signatures)

### Détection d'anomalies
- Implémenter des alertes sur les patterns anormaux (volume de tokens inhabituels, patterns de prompt injection)
- Surveiller les coûts d'inférence pour détecter un unbounded consumption (LLM10)
- Détecter les comportements de jailbreak réussis via analyse des sorties
- Mettre en place des canaries prompts pour détecter la fuite du system prompt

### Observabilité
- Tracer les appels de bout en bout (distributed tracing : Jaeger, OpenTelemetry)
- Exposer des métriques (latence, taux d'erreur, taux de refus) dans des dashboards
- Définir des SLO/SLA de sécurité et alerter sur les violations
- Mettre en place des health checks et des circuit breakers

---

## 7. Limitation de débit et protection contre les abus

### Rate limiting
- Limiter le nombre de requêtes par IP, par utilisateur et par session (ex. 10 req/min)
- Implémenter un backoff exponentiel en cas de dépassement
- Bloquer temporairement les IPs après N tentatives échouées (protection brute force)

### Protection anti-DoS / DDoS
- Utiliser un WAF (Web Application Firewall) devant l'API LLM
- Configurer des règles de protection contre les attaques par flooding de tokens
- Limiter la taille des payloads en entrée (max body size)
- Utiliser un CDN avec protection DDoS (Cloudflare, AWS Shield)

### Quotas et budgets
- Définir des quotas de tokens par utilisateur/organisation (entrée + sortie)
- Alerter et bloquer automatiquement lorsque le budget est dépassé
- Séparer les quotas par environnement (dev, staging, prod)

---

## 8. Sécurité des plugins et des agents

### Contrôle des outils (Function Calling / Tool Use)
- Définir une liste blanche des outils accessibles par le LLM
- Valider les paramètres de chaque appel d'outil avant exécution
- Ne pas permettre l'appel d'outils dangereux (shell, system, eval) depuis le LLM
- Logger chaque appel d'outil avec ses paramètres et son résultat

### Agentique (LLM Agents)
- Limiter la profondeur des chaînes d'action (max steps) pour éviter les boucles infinies
- Implémenter un superviseur humain pour les actions irréversibles (envoi d'email, suppression)
- Isoler les agents dans des environnements sandbox avec permissions minimales
- Détecter et interrompre les comportements divergents ou récursifs

---

## 9. Tests de sécurité

### Red-teaming IA
- Organiser des sessions de red-teaming dédiées aux LLM (prompt injection, jailbreak, extraction)
- Utiliser des outils spécialisés : Garak, PyRIT, Promptfoo, PromptBench
- Documenter et corriger chaque vecteur d'attaque identifié
- Intégrer le red-teaming dans le cycle de développement (CI/CD)

### Tests automatisés
- Intégrer des tests de sécurité LLM dans le pipeline CI/CD
- Tester automatiquement les scénarios d'injection à chaque déploiement
- Effectuer des scans SAST/DAST sur le code de l'application LLM
- Valider la conformité des sorties par des assertions automatiques

### Audit et conformité
- Réaliser des audits de sécurité externes périodiques (au moins annuellement)
- Effectuer des DPIA (Data Protection Impact Assessment) avant chaque déploiement majeur
- Tester la conformité RGPD des flux de données (droit à l'effacement, portabilité)
- Produire des rapports de conformité pour les régulateurs (CNIL, EU AI Act)

---

## 10. Plan de réponse aux incidents

### Préparation
- Définir un playbook de réponse aux incidents spécifique LLM (fuite de données, jailbreak, hallucination massive)
- Identifier les responsables (CISO, DPO, équipe SRE) et les escalades
- Mettre en place des procédures de notification CNIL (72h RGPD Art. 33)

### Détection et confinement
- Avoir la capacité de couper rapidement l'accès au LLM (kill switch)
- Isoler les sessions compromises sans impacter les autres utilisateurs
- Préserver les logs forensiques avant toute action corrective

### Récupération et retour d'expérience
- Corriger la vulnérabilité exploitée avant de remettre le service en production
- Documenter l'incident dans un post-mortem
- Mettre à jour les règles de détection et les tests de régression
- Notifier les utilisateurs impactés conformément aux obligations légales

---

## Référentiel de conformité

| Domaine | Référentiel |
|---|---|
| Sécurité LLM | OWASP Top 10 for LLM Applications 2025 |
| Protection des données | RGPD (Règlement UE 2016/679) |
| IA responsable | EU AI Act (Règlement UE 2024/1689) |
| Gestion des risques IA | NIST AI RMF 1.0 |
| Management de la sécurité | ISO/IEC 27001 |
| Gouvernance IA | ISO/IEC 42001 |

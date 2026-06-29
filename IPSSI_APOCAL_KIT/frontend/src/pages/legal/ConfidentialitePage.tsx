/** Politique de confidentialité — EduTutor IA (APOCAL'IPSSI 2026). */
import { Link } from 'react-router-dom';
import LegalScaffold from './LegalScaffold';

export default function ConfidentialitePage() {
  return (
    <LegalScaffold
      title="Politique de confidentialité"
      intro="Comment les données personnelles des utilisateurs sont collectées, utilisées et protégées, conformément au Règlement Général sur la Protection des Données (RGPD — UE 2016/679)."
      sections={[]}
    >
      <div className="space-y-6">

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">1. Responsable du traitement</h2>
          <p className="text-slate-700">
            Le responsable du traitement des données personnelles collectées sur EduTutor IA est
            l'équipe étudiante porteuse du projet, dans le cadre pédagogique IPSSI / APOCAL'IPSSI 2026.
          </p>
          <p className="mt-2 text-slate-700">
            Contact :{' '}
            <a href="mailto:contact@edututor-ia.fr" className="text-indigo-700 underline">
              contact@edututor-ia.fr
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">2. Données personnelles collectées</h2>
          <p className="text-slate-700 mb-2">
            EduTutor IA collecte uniquement les données strictement nécessaires au fonctionnement
            du service (principe de minimisation, art. 5 RGPD) :
          </p>
          <ul className="text-slate-700 text-sm space-y-1 pl-4 list-disc">
            <li><span className="font-medium">Données d'identification :</span> adresse email (identifiant unique), prénom et nom (facultatifs).</li>
            <li><span className="font-medium">Données de sécurité :</span> mot de passe haché (bcrypt via Django) — jamais stocké en clair.</li>
            <li><span className="font-medium">Contenus déposés :</span> textes de cours et fichiers PDF soumis pour la génération de quiz. Ces contenus sont traités localement par le modèle Ollama et ne sont pas transmis à des tiers par défaut.</li>
            <li><span className="font-medium">Données d'usage :</span> quiz générés, réponses soumises, scores obtenus, horodatages (créé le, modifié le).</li>
          </ul>
          <p className="mt-2 text-sm text-slate-500">
            Aucune donnée de navigation, de géolocalisation ou de tracking publicitaire n'est collectée.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">3. Finalités du traitement</h2>
          <ul className="text-slate-700 text-sm space-y-2 pl-4 list-disc">
            <li><span className="font-medium">Gestion du compte :</span> création, authentification, modification et suppression du compte utilisateur.</li>
            <li><span className="font-medium">Fourniture du service :</span> génération de quiz à partir des contenus déposés, correction automatique, calcul du score.</li>
            <li><span className="font-medium">Suivi de progression :</span> conservation de l'historique des quiz et des statistiques de l'utilisateur.</li>
            <li><span className="font-medium">Sécurité :</span> vérification d'email, réinitialisation de mot de passe, gestion des sessions.</li>
            <li><span className="font-medium">Administration :</span> gestion des utilisateurs et configuration de la plateforme par les administrateurs.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">4. Base légale (art. 6 RGPD)</h2>
          <ul className="text-slate-700 text-sm space-y-2 pl-4 list-disc">
            <li><span className="font-medium">Exécution du contrat (art. 6.1.b) :</span> traitement nécessaire à la fourniture du service (compte, quiz, historique).</li>
            <li><span className="font-medium">Intérêt légitime (art. 6.1.f) :</span> sécurité de la plateforme et prévention des abus.</li>
            <li><span className="font-medium">Consentement (art. 6.1.a) :</span> pour les données facultatives (prénom, nom) et l'activation de la vérification d'email.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">5. Durée de conservation</h2>
          <ul className="text-slate-700 text-sm space-y-2 pl-4 list-disc">
            <li><span className="font-medium">Données de compte :</span> conservées jusqu'à la suppression du compte par l'utilisateur ou sur demande.</li>
            <li><span className="font-medium">Contenus de cours (textes, PDF) :</span> stockés en base pour la durée de vie du quiz associé ; supprimés avec le compte.</li>
            <li><span className="font-medium">Historique de quiz :</span> conservé jusqu'à la suppression du compte.</li>
            <li><span className="font-medium">Tokens de vérification / réinitialisation :</span> expirés automatiquement selon les délais configurés (par défaut : 24h).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">6. Destinataires des données</h2>
          <p className="text-slate-700">
            Les données sont accessibles uniquement aux membres de l'équipe de développement ayant
            un accès administrateur à la base de données, dans le cadre strict du projet pédagogique.
          </p>
          <p className="mt-2 text-slate-700">
            Par défaut, <strong>aucune donnée n'est transmise à un tiers</strong> : le modèle d'IA
            (Ollama / Llama 3.1) fonctionne entièrement en local. Si un fournisseur cloud est activé
            manuellement (Gemini, OpenAI, etc.), les contenus soumis sont alors transmis à ce
            fournisseur — l'utilisateur en est informé lors de la configuration.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">7. Transferts hors Union européenne</h2>
          <p className="text-slate-700">
            Dans la configuration par défaut (Ollama local), <strong>aucun transfert hors UE</strong>{' '}
            n'a lieu. Si un fournisseur cloud américain est activé (OpenAI, Anthropic, Google Gemini,
            Groq), les données sont traitées hors UE. Ces fournisseurs sont soumis aux clauses
            contractuelles types (CCT) de la Commission européenne ou à d'autres garanties appropriées
            (art. 46 RGPD). L'utilisation de ces fournisseurs reste optionnelle et à l'initiative
            de l'administrateur.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">8. Vos droits (art. 15 à 22 RGPD)</h2>
          <p className="text-slate-700 mb-2">Vous disposez des droits suivants sur vos données personnelles :</p>
          <ul className="text-slate-700 text-sm space-y-1 pl-4 list-disc">
            <li><span className="font-medium">Droit d'accès (art. 15) :</span> obtenir une copie des données vous concernant.</li>
            <li><span className="font-medium">Droit de rectification (art. 16) :</span> corriger vos informations depuis la page Profil.</li>
            <li><span className="font-medium">Droit à l'effacement / « droit à l'oubli » (art. 17) :</span> supprimer définitivement votre compte et toutes les données associées via la page Profil → « Supprimer mon compte ».</li>
            <li><span className="font-medium">Droit à la portabilité (art. 20) :</span> demander une exportation de vos données.</li>
            <li><span className="font-medium">Droit d'opposition (art. 21) :</span> vous opposer à un traitement fondé sur l'intérêt légitime.</li>
            <li><span className="font-medium">Droit à la limitation (art. 18) :</span> demander la suspension temporaire d'un traitement.</li>
          </ul>
          <p className="mt-2 text-slate-700 text-sm">
            Pour exercer ces droits, contactez-nous à{' '}
            <a href="mailto:contact@edututor-ia.fr" className="text-indigo-700 underline">
              contact@edututor-ia.fr
            </a>
            . Nous nous engageons à répondre dans un délai d'un mois (art. 12 RGPD).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">9. Cookies et stockage local</h2>
          <p className="text-slate-700">
            Consultez notre{' '}
            <Link to="/legal/cookies" className="text-indigo-700 underline">
              Politique de gestion des cookies
            </Link>{' '}
            pour le détail des technologies de stockage utilisées par EduTutor IA.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">10. Contact & réclamation</h2>
          <p className="text-slate-700">
            Pour toute question relative à la protection de vos données :{' '}
            <a href="mailto:contact@edututor-ia.fr" className="text-indigo-700 underline">
              contact@edututor-ia.fr
            </a>
          </p>
          <p className="mt-2 text-slate-700">
            Si vous estimez que vos droits ne sont pas respectés, vous avez le droit d'introduire
            une réclamation auprès de la{' '}
            <a
              href="https://www.cnil.fr/fr/plaintes"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-700 underline"
            >
              CNIL (Commission Nationale de l'Informatique et des Libertés)
            </a>
            .
          </p>
        </section>

      </div>

      <p className="text-xs text-slate-400 mt-10 pt-4 border-t border-slate-200">
        Dernière mise à jour : 29 juin 2026. Document rédigé dans le cadre pédagogique APOCAL'IPSSI 2026.
      </p>
    </LegalScaffold>
  );
}

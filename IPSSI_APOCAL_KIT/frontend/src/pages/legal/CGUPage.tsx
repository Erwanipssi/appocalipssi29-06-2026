/** Conditions Générales d'Utilisation — EduTutor IA (APOCAL'IPSSI 2026). */
import LegalScaffold from './LegalScaffold';

export default function CGUPage() {
  return (
    <LegalScaffold
      title="Conditions Générales d'Utilisation"
      intro="Les règles encadrant l'utilisation du service EduTutor IA. En créant un compte, l'utilisateur accepte les présentes CGU dans leur intégralité."
      sections={[]}
    >
      <div className="space-y-6">

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">1. Objet</h2>
          <p className="text-slate-700">
            Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation
            de la plateforme <strong>EduTutor IA</strong>, service en ligne permettant à des
            étudiants de générer automatiquement des quiz de révision à partir de leurs cours,
            via un modèle de langage (LLM).
          </p>
          <p className="mt-2 text-slate-700">
            EduTutor IA est un projet pédagogique développé dans le cadre de la semaine immersive
            APOCAL'IPSSI 2026 à l'IPSSI Paris. Le service est fourni à titre expérimental et
            à vocation non commerciale.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">2. Acceptation des conditions</h2>
          <p className="text-slate-700">
            L'utilisation du service implique l'acceptation pleine et entière des présentes CGU.
            Cette acceptation est matérialisée lors de la création d'un compte (inscription).
            Si l'utilisateur refuse ces conditions, il doit renoncer à l'utilisation du service.
          </p>
          <p className="mt-2 text-slate-700">
            Les CGU peuvent être modifiées à tout moment. L'utilisateur est invité à les consulter
            régulièrement. La poursuite de l'utilisation du service après modification vaut
            acceptation des nouvelles conditions.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">3. Accès au service</h2>
          <p className="text-slate-700">
            L'accès au service est réservé aux personnes physiques majeures ou aux mineurs avec
            l'autorisation de leur représentant légal. Il nécessite la création d'un compte
            via une adresse email valide.
          </p>
          <p className="mt-2 text-slate-700">
            Le service est accessible via un navigateur web moderne (Chrome, Firefox, Safari, Edge).
            EduTutor IA s'engage à maintenir le service disponible dans les limites du cadre
            pédagogique et des ressources techniques disponibles. Des interruptions peuvent
            survenir pour maintenance ou en cas de perturbation du réseau.
          </p>
          <p className="mt-2 text-slate-700">
            La génération de quiz requiert un modèle LLM actif. Dans la configuration locale
            (Ollama), la disponibilité dépend des ressources matérielles du serveur d'hébergement.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">4. Compte utilisateur</h2>
          <p className="text-slate-700">
            L'utilisateur s'inscrit en fournissant une adresse email valide et un mot de passe
            sécurisé. L'email est l'identifiant unique du compte ; le prénom et le nom sont
            facultatifs.
          </p>
          <p className="mt-2 text-slate-700">
            L'utilisateur est responsable de la confidentialité de ses identifiants et de toute
            activité réalisée depuis son compte. Il s'engage à notifier immédiatement toute
            utilisation non autorisée.
          </p>
          <p className="mt-2 text-slate-700">
            L'utilisateur peut modifier ses informations ou supprimer son compte à tout moment
            depuis la page <strong>Profil</strong>. La suppression entraîne l'effacement définitif
            de toutes les données associées (quiz, historique, contenus déposés).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">5. Comportements interdits</h2>
          <p className="text-slate-700 mb-2">Il est interdit d'utiliser EduTutor IA pour :</p>
          <ul className="text-slate-700 text-sm space-y-1 pl-4 list-disc">
            <li>Déposer des contenus illicites, protégés par des droits tiers sans autorisation, ou portant atteinte à la vie privée d'autrui.</li>
            <li>Tenter de contourner les mécanismes de sécurité ou d'authentification de la plateforme.</li>
            <li>Injecter des instructions malveillantes dans les contenus déposés afin de manipuler le modèle LLM (<em>prompt injection</em>).</li>
            <li>Soumettre des contenus visant à générer des quiz à caractère haineux, discriminatoire ou illégal.</li>
            <li>Surcharger volontairement les serveurs (requêtes automatisées abusives, scraping).</li>
            <li>Usurper l'identité d'un autre utilisateur ou d'un administrateur.</li>
            <li>Utiliser le service à des fins commerciales sans accord préalable écrit.</li>
          </ul>
          <p className="mt-2 text-slate-700">
            Tout manquement à ces règles peut entraîner la suspension ou la suppression du compte,
            sans préavis.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">6. Contenu généré par IA</h2>
          <p className="text-slate-700">
            Les quiz générés par EduTutor IA sont produits automatiquement par un modèle de
            langage (LLM). Bien que le système s'appuie sur le contenu soumis par l'utilisateur,
            les questions et réponses peuvent contenir des <strong>erreurs ou inexactitudes</strong>.
          </p>
          <p className="mt-2 text-slate-700">
            EduTutor IA est un outil d'aide à la révision, non un garant de la véracité académique
            des contenus générés. L'utilisateur est seul responsable de l'interprétation et de
            l'usage qu'il fait des quiz produits. Il est conseillé de croiser les résultats avec
            ses supports de cours officiels.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">7. Responsabilité</h2>
          <p className="text-slate-700">
            EduTutor IA est fourni <em>en l'état</em>, dans un cadre pédagogique et expérimental.
            L'équipe éditrice ne saurait être tenue responsable :
          </p>
          <ul className="text-slate-700 text-sm space-y-1 pl-4 list-disc mt-2">
            <li>Des erreurs ou omissions dans les quiz générés par le LLM.</li>
            <li>Des interruptions de service liées aux contraintes matérielles ou réseau.</li>
            <li>De tout dommage direct ou indirect résultant de l'utilisation du service.</li>
            <li>De la perte de données en cas de défaillance technique imprévue.</li>
          </ul>
          <p className="mt-2 text-slate-700">
            L'utilisateur utilise le service sous sa seule responsabilité.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">8. Propriété intellectuelle</h2>
          <p className="text-slate-700">
            Le code source d'EduTutor IA est distribué sous licence CC BY-NC-SA 4.0.
            Les contenus déposés par l'utilisateur (textes, PDF) restent sa propriété exclusive.
            En déposant un contenu, l'utilisateur accorde à EduTutor IA une licence limitée,
            non exclusive et non transférable, uniquement pour la génération du quiz demandé.
          </p>
          <p className="mt-2 text-slate-700">
            L'utilisateur garantit qu'il dispose des droits nécessaires sur les contenus qu'il dépose
            et que ces contenus ne portent pas atteinte aux droits de tiers.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">9. Modification des CGU</h2>
          <p className="text-slate-700">
            L'équipe éditrice se réserve le droit de modifier les présentes CGU à tout moment.
            Les modifications entrent en vigueur dès leur publication sur le site. La date de
            dernière mise à jour est indiquée en bas de page. L'utilisation du service après
            toute modification vaut acceptation des nouvelles CGU.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">10. Droit applicable et litiges</h2>
          <p className="text-slate-700">
            Les présentes CGU sont régies par le droit français. En cas de litige, les parties
            s'engagent à rechercher une solution amiable avant tout recours judiciaire.
            À défaut d'accord, les tribunaux compétents seront ceux du ressort de Paris.
          </p>
        </section>

      </div>

      <p className="text-xs text-slate-400 mt-10 pt-4 border-t border-slate-200">
        Dernière mise à jour : 29 juin 2026. Document rédigé dans le cadre pédagogique APOCAL'IPSSI 2026.
      </p>
    </LegalScaffold>
  );
}

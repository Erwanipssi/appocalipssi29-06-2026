/** Politique de gestion des cookies — EduTutor IA (APOCAL'IPSSI 2026). */
import LegalScaffold from './LegalScaffold';

export default function CookiesPage() {
  return (
    <LegalScaffold
      title="Politique de gestion des cookies"
      intro="Les cookies et technologies de stockage utilisés par EduTutor IA, leur finalité, et comment les gérer."
      sections={[]}
    >
      <div className="space-y-6">

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">1. Qu'est-ce qu'un cookie ?</h2>
          <p className="text-slate-700">
            Un cookie est un petit fichier texte déposé par un site web sur votre navigateur lors
            de votre visite. Il permet de mémoriser des informations entre deux visites ou entre
            deux pages d'un même site.
          </p>
          <p className="mt-2 text-slate-700">
            Au sens large, on parle également de <strong>stockage local</strong> (<em>localStorage</em>,{' '}
            <em>sessionStorage</em>) : des mécanismes similaires intégrés aux navigateurs modernes
            qui permettent de stocker des données côté client sans les envoyer automatiquement au
            serveur à chaque requête.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">2. Cookies et stockage utilisés par EduTutor IA</h2>
          <p className="text-slate-700 mb-3">
            EduTutor IA utilise uniquement des technologies de stockage <strong>strictement nécessaires</strong>{' '}
            au fonctionnement du service. Aucun cookie publicitaire ou de traçage tiers n'est utilisé.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-slate-200 rounded">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="text-left p-2 border-b border-slate-200 font-semibold">Nom / Clé</th>
                  <th className="text-left p-2 border-b border-slate-200 font-semibold">Type</th>
                  <th className="text-left p-2 border-b border-slate-200 font-semibold">Finalité</th>
                  <th className="text-left p-2 border-b border-slate-200 font-semibold">Durée</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                <tr className="border-b border-slate-100">
                  <td className="p-2 font-mono text-xs">token</td>
                  <td className="p-2">localStorage</td>
                  <td className="p-2">Jeton d'authentification JWT — maintient la session de l'utilisateur connecté</td>
                  <td className="p-2">Jusqu'à déconnexion ou expiration du token</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="p-2 font-mono text-xs">theme</td>
                  <td className="p-2">localStorage</td>
                  <td className="p-2">Mémorise le choix du mode d'affichage (clair ou sombre)</td>
                  <td className="p-2">Indéfinie (jusqu'à effacement manuel)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-slate-500">
            Ces données sont stockées <strong>exclusivement dans votre navigateur</strong> et ne sont
            pas transmises à des tiers. Aucun cookie de session HTTP classique n'est utilisé par
            l'application React.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">3. Finalité de chaque élément de stockage</h2>
          <ul className="text-slate-700 text-sm space-y-3 pl-4 list-disc">
            <li>
              <span className="font-medium">token (localStorage) :</span> indispensable au
              fonctionnement du service. Sans ce jeton, l'utilisateur est déconnecté à chaque
              rechargement de page et ne peut accéder à ses quiz ni à son profil. Ce stockage
              relève de la catégorie « strictement nécessaire » et ne requiert pas de consentement
              préalable (directive ePrivacy, considérant 25).
            </li>
            <li>
              <span className="font-medium">theme (localStorage) :</span> améliore le confort
              d'utilisation en mémorisant votre préférence d'affichage. Ne contient aucune donnée
              personnelle. Peut être considéré comme un cookie de fonctionnalité (nécessaire à la
              bonne expérience, sans traçage).
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">4. Consentement</h2>
          <p className="text-slate-700">
            Les deux éléments de stockage utilisés sont <strong>strictement nécessaires</strong> au
            fonctionnement et à la personnalisation minimale du service. Conformément aux lignes
            directrices de la CNIL et à la directive ePrivacy, ils ne requièrent pas de consentement
            préalable.
          </p>
          <p className="mt-2 text-slate-700">
            EduTutor IA n'utilise <strong>aucun cookie analytique, publicitaire ou de traçage</strong>{' '}
            tiers. Aucune bannière de consentement n'est donc techniquement requise dans la
            configuration actuelle du service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">5. Durée de conservation</h2>
          <ul className="text-slate-700 text-sm space-y-1 pl-4 list-disc">
            <li>
              <span className="font-medium">token :</span> conservé jusqu'à déconnexion explicite
              ou expiration du jeton côté serveur (durée configurée par l'administrateur,
              par défaut selon les paramètres Django REST Framework / SimpleJWT).
            </li>
            <li>
              <span className="font-medium">theme :</span> conservé sans limite de durée ; effacé
              si vous videz le localStorage de votre navigateur.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">6. Gérer ou supprimer les données de stockage</h2>
          <p className="text-slate-700 mb-2">
            Vous pouvez à tout moment supprimer ces données depuis les paramètres de votre navigateur :
          </p>
          <ul className="text-slate-700 text-sm space-y-1 pl-4 list-disc">
            <li><span className="font-medium">Chrome :</span> Paramètres → Confidentialité et sécurité → Effacer les données de navigation → Cookies et autres données de site.</li>
            <li><span className="font-medium">Firefox :</span> Paramètres → Vie privée et sécurité → Cookies et données de sites → Effacer les données.</li>
            <li><span className="font-medium">Safari :</span> Préférences → Confidentialité → Gérer les données de sites web.</li>
            <li><span className="font-medium">Edge :</span> Paramètres → Confidentialité, recherche et services → Effacer les données de navigation.</li>
          </ul>
          <p className="mt-2 text-slate-700 text-sm">
            La suppression du <code className="bg-slate-100 px-1 rounded text-xs">token</code> vous
            déconnectera de l'application. Vos données de compte (quiz, historique) restent
            conservées côté serveur ; seule la suppression de votre compte les efface définitivement.
          </p>
          <p className="mt-2 text-slate-700 text-sm">
            Vous pouvez également vous déconnecter depuis l'interface EduTutor IA, ce qui efface
            le token d'authentification du localStorage.
          </p>
        </section>

      </div>

      <p className="text-xs text-slate-400 mt-10 pt-4 border-t border-slate-200">
        Dernière mise à jour : 29 juin 2026. Document rédigé dans le cadre pédagogique APOCAL'IPSSI 2026.
      </p>
    </LegalScaffold>
  );
}

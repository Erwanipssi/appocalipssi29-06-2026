/** Mentions légales — EduTutor IA (APOCAL'IPSSI 2026). */
import LegalScaffold from './LegalScaffold';

export default function MentionsLegalesPage() {
  return (
    <LegalScaffold
      title="Mentions légales"
      intro="Informations légales obligatoires identifiant l'éditeur et l'hébergeur du site EduTutor IA."
      sections={[]}
    >
      <div className="space-y-6">

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">1. Éditeur du site</h2>
          <p className="text-slate-700">
            Le site <strong>EduTutor IA</strong> est édité dans le cadre d'un projet pédagogique
            réalisé par une équipe d'étudiants de l'école{' '}
            <strong>IPSSI Paris</strong> (Institut Polytechnique des Sciences Avancées),
            dans le cadre de la semaine immersive APOCAL'IPSSI 2026.
          </p>
          <ul className="mt-2 text-slate-700 space-y-1 text-sm list-none">
            <li><span className="font-medium">Établissement :</span> IPSSI — 4 rue Vulpian, 75013 Paris</li>
            <li><span className="font-medium">Statut :</span> Projet étudiant à vocation pédagogique, sans activité commerciale</li>
            <li><span className="font-medium">Contact :</span>{' '}
              <a href="mailto:contact@edututor-ia.fr" className="text-indigo-700 underline">
                contact@edututor-ia.fr
              </a>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">2. Directeur de la publication</h2>
          <p className="text-slate-700">
            La publication du site est assurée par le chef de projet désigné au sein de l'équipe
            étudiante responsable du projet EduTutor IA, sous la supervision pédagogique de
            Mohammed EL AFRIT, intervenant IPSSI.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">3. Hébergeur</h2>
          <p className="text-slate-700">
            Dans sa version de développement, l'application est hébergée <strong>localement</strong>{' '}
            via Docker sur les postes des membres de l'équipe. Aucun hébergeur tiers n'est impliqué
            pour cette version.
          </p>
          <p className="mt-2 text-slate-700">
            En cas de déploiement sur un serveur distant, les informations de l'hébergeur
            (raison sociale, adresse, numéro de téléphone) seront indiquées ici, conformément
            à la loi n° 2004-575 du 21 juin 2004 pour la Confiance dans l'Économie Numérique.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">4. Propriété intellectuelle</h2>
          <p className="text-slate-700">
            Le code source d'EduTutor IA est distribué sous licence{' '}
            <strong>CC BY-NC-SA 4.0</strong> (Creative Commons Attribution – Pas d'Utilisation
            Commerciale – Partage dans les Mêmes Conditions). Toute réutilisation à des fins
            commerciales est interdite sans accord préalable écrit.
          </p>
          <p className="mt-2 text-slate-700">
            Les <strong>contenus déposés par les utilisateurs</strong> (textes de cours, fichiers PDF)
            restent la propriété exclusive de leurs auteurs. EduTutor IA ne revendique aucun droit
            sur ces contenus et ne les utilise qu'aux seules fins de générer les quiz demandés.
          </p>
          <p className="mt-2 text-slate-700">
            Les quiz générés automatiquement par le modèle de langage ne constituent pas une
            œuvre originale protégée au sens du Code de la propriété intellectuelle.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">5. Contact</h2>
          <p className="text-slate-700">
            Pour toute question d'ordre juridique concernant ce site :{' '}
            <a href="mailto:contact@edututor-ia.fr" className="text-indigo-700 underline">
              contact@edututor-ia.fr
            </a>
          </p>
        </section>

      </div>

      <p className="text-xs text-slate-400 mt-10 pt-4 border-t border-slate-200">
        Dernière mise à jour : 29 juin 2026. Document rédigé dans le cadre pédagogique APOCAL'IPSSI 2026.
      </p>
    </LegalScaffold>
  );
}

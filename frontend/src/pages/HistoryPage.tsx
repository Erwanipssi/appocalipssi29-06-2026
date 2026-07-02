import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { listQuizzes, type QuizSummary } from '@/api/quizzes';

export default function HistoryPage() {
  const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subjectFilter, setSubjectFilter] = useState('');
  const [classFilter, setClassFilter] = useState('');

  useEffect(() => {
    setLoading(true);
    listQuizzes({
      subject: subjectFilter || undefined,
      class_name: classFilter || undefined,
    })
      .then((res) => setQuizzes(res.results))
      .catch(() => setError("Impossible de charger l'historique."))
      .finally(() => setLoading(false));
  }, [subjectFilter, classFilter]);

  const subjects = useMemo(
    () => Array.from(new Set(quizzes.map((q) => q.subject).filter(Boolean))).sort(),
    [quizzes],
  );
  const classes = useMemo(
    () => Array.from(new Set(quizzes.map((q) => q.class_name).filter(Boolean))).sort(),
    [quizzes],
  );

  if (loading) return <p className="text-slate-500">Chargement…</p>;
  if (error) return <p className="text-rose-600">{error}</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Mon historique</h1>
          <p className="text-slate-500 text-sm">
            {quizzes.length === 0
              ? "Aucun quiz pour l'instant — créez votre premier !"
              : `${quizzes.length} quiz au compteur.`}
          </p>
        </div>
        <Link to="/upload" className="btn-primary">
          + Nouveau quiz
        </Link>
      </div>

      <div className="card flex flex-wrap gap-3">
        <div>
          <label className="block text-xs text-slate-500 mb-1">Matière</label>
          <select
            className="input"
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
          >
            <option value="">Toutes</option>
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">Classe</label>
          <select
            className="input"
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
          >
            <option value="">Toutes</option>
            {classes.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {quizzes.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-5xl mb-4">📚</div>
          <p className="text-slate-600 mb-4">Pas encore de quiz dans votre historique.</p>
          <Link to="/upload" className="btn-primary">
            Créer mon premier quiz
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {quizzes.map((q) => (
            <Link
              key={q.id}
              to={q.status === 'draft' ? `/quiz/${q.id}/review` : `/quiz/${q.id}`}
              className="card hover:border-indigo-500 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs text-slate-500">
                  #{q.id} · {new Date(q.created_at).toLocaleDateString('fr-FR')}
                </span>
                <div className="flex gap-1">
                  {q.status === 'draft' && (
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-xs font-mono">
                      brouillon
                    </span>
                  )}
                  {q.score !== null && (
                    <span
                      className={`px-2 py-0.5 rounded font-mono text-sm font-bold ${
                        q.score >= 7
                          ? 'bg-emerald-100 text-emerald-700'
                          : q.score >= 4
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {q.score} / 10
                    </span>
                  )}
                  {q.score === null && q.status === 'published' && (
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-xs font-mono">
                      pas encore passé
                    </span>
                  )}
                </div>
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">{q.title}</h3>
              <p className="text-sm text-slate-500">
                {q.nb_questions} questions
                {q.subject && ` · ${q.subject}`}
                {q.class_name && ` · ${q.class_name}`}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

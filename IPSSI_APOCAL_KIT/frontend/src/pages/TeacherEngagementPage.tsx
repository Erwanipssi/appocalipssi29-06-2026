import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getClassEngagement, listQuizzes, type ClassEngagement, type QuizSummary } from '@/api/quizzes';

export default function TeacherEngagementPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialClass = searchParams.get('class') ?? '';

  const [className, setClassName] = useState(initialClass);
  const [engagement, setEngagement] = useState<ClassEngagement | null>(null);
  const [myQuizzes, setMyQuizzes] = useState<QuizSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listQuizzes()
      .then((res) => setMyQuizzes(res.results))
      .catch(() => {});
  }, []);

  const classOptions = Array.from(
    new Set(myQuizzes.map((q) => q.class_name).filter(Boolean)),
  ).sort();

  const loadEngagement = async (name: string) => {
    if (!name.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getClassEngagement(name.trim());
      setEngagement(data);
      setSearchParams({ class: name.trim() });
    } catch {
      setError('Impossible de charger les statistiques de classe.');
      setEngagement(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialClass) loadEngagement(initialClass);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Engagement de la classe</h1>
        <p className="text-slate-500 text-sm">
          Suivez la participation et les scores moyens par cohorte (US-16).
        </p>
      </div>

      <div className="card flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm text-slate-600 mb-1">Classe</label>
          <input
            list="class-options"
            className="input"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            placeholder="Ex. BTS Com 1A"
          />
          <datalist id="class-options">
            {classOptions.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>
        <button
          type="button"
          onClick={() => loadEngagement(className)}
          disabled={loading || !className.trim()}
          className="btn-primary"
        >
          {loading ? 'Chargement…' : 'Analyser'}
        </button>
      </div>

      {error && <p className="text-rose-600">{error}</p>}

      {engagement && (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Mes quiz" value={engagement.my_quizzes} />
            <StatCard label="Publiés" value={engagement.published_quizzes} />
            <StatCard label="Élèves actifs" value={engagement.students_participated} />
            <StatCard
              label="Score moyen classe"
              value={
                engagement.average_class_score !== null
                  ? `${engagement.average_class_score} / 10`
                  : '—'
              }
            />
          </div>

          <div className="card">
            <h2 className="font-semibold text-slate-900 mb-4">
              Quiz publiés — {engagement.class_name}
            </h2>
            {engagement.quizzes.length === 0 ? (
              <p className="text-slate-500 text-sm">Aucun quiz publié pour cette classe.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {engagement.quizzes.map((q) => (
                  <li key={q.id} className="py-3 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <Link to={`/quiz/${q.id}/review`} className="font-medium text-indigo-600 hover:underline">
                        {q.title}
                      </Link>
                      {q.subject && (
                        <span className="ml-2 text-xs text-slate-500">{q.subject}</span>
                      )}
                    </div>
                    <span className="text-sm text-slate-600 font-mono">
                      {q.attempts} tentative{q.attempts !== 1 ? 's' : ''}
                      {q.average_score !== null && ` · moy. ${q.average_score}/10`}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="card text-center">
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      <div className="text-sm text-slate-500">{label}</div>
    </div>
  );
}

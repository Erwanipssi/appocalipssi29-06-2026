import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  exportQuizPdf,
  getQuiz,
  publishQuiz,
  updateQuestion,
  updateQuizMeta,
  type Quiz,
} from '@/api/quizzes';
import { getApiErrorMessage } from '@/api/errors';

export default function QuizReviewPage() {
  const { id } = useParams<{ id: string }>();
  const quizId = Number(id);

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [subject, setSubject] = useState('');
  const [className, setClassName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    getQuiz(quizId)
      .then((q) => {
        setQuiz(q);
        setSubject(q.subject);
        setClassName(q.class_name);
      })
      .catch(() => setError('Impossible de charger ce quiz.'))
      .finally(() => setLoading(false));
  }, [quizId]);

  const handleSaveMeta = async () => {
    if (!quiz) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await updateQuizMeta(quiz.id, { subject, class_name: className });
      setQuiz(updated);
      setMessage('Matière et classe enregistrées.');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Échec de la sauvegarde.'));
    } finally {
      setSaving(false);
    }
  };

  const handleEditQuestion = async (index: number, prompt: string) => {
    if (!quiz || quiz.status !== 'draft') return;
    try {
      const updated = await updateQuestion(quiz.id, index, { prompt });
      setQuiz(updated);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Échec de la modification.'));
    }
  };

  const handlePublish = async () => {
    if (!quiz) return;
    setSaving(true);
    setError(null);
    try {
      await updateQuizMeta(quiz.id, { subject, class_name: className });
      const updated = await publishQuiz(quiz.id);
      setQuiz(updated);
      setMessage('Quiz publié — vos élèves peuvent le passer.');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Échec de la publication.'));
    } finally {
      setSaving(false);
    }
  };

  const handleExportPdf = async (withAnswers: boolean) => {
    if (!quiz) return;
    try {
      const blob = await exportQuizPdf(quiz.id, withAnswers);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `quiz-${quiz.id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Échec de l’export PDF.'));
    }
  };

  if (loading) return <p className="text-slate-500">Chargement…</p>;
  if (error && !quiz) return <p className="text-rose-600">{error}</p>;
  if (!quiz) return null;

  const isDraft = quiz.status === 'draft';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Relecture enseignante</h1>
        <p className="text-sm text-slate-500">
          {quiz.title} ·{' '}
          <span
            className={`font-mono text-xs px-2 py-0.5 rounded ${
              isDraft ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
            }`}
          >
            {isDraft ? 'Brouillon' : 'Publié'}
          </span>
        </p>
      </div>

      {message && (
        <div className="p-3 bg-emerald-50 border-l-4 border-emerald-500 text-sm text-emerald-900 rounded">
          {message}
        </div>
      )}
      {error && (
        <div className="p-3 bg-rose-50 border-l-4 border-rose-500 text-sm text-rose-900 rounded">
          {error}
        </div>
      )}

      <div className="card space-y-3">
        <h2 className="font-semibold text-slate-900">Organisation (US-15)</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-slate-600 mb-1">Matière</label>
            <input
              className="input"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Ex. Communication"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">Classe</label>
            <input
              className="input"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="Ex. BTS Com 1A"
            />
          </div>
        </div>
        <button type="button" onClick={handleSaveMeta} disabled={saving} className="btn-secondary">
          Enregistrer matière / classe
        </button>
      </div>

      <div className="space-y-4">
        {quiz.questions.map((q) => (
          <div key={q.index} className="card space-y-2">
            <label className="block text-sm font-medium text-slate-700">Question {q.index}</label>
            {isDraft ? (
              <textarea
                className="input"
                rows={2}
                defaultValue={q.prompt}
                onBlur={(e) => {
                  if (e.target.value !== q.prompt) handleEditQuestion(q.index, e.target.value);
                }}
              />
            ) : (
              <p className="text-slate-800">{q.prompt}</p>
            )}
            <ul className="text-sm text-slate-600 space-y-1">
              {q.options.map((opt, i) => (
                <li key={i} className={i === q.correct_index ? 'text-emerald-700 font-medium' : ''}>
                  {String.fromCharCode(65 + i)}. {opt}
                  {i === q.correct_index && ' ✓'}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={() => handleExportPdf(false)} className="btn-secondary">
          Export PDF (élèves)
        </button>
        <button type="button" onClick={() => handleExportPdf(true)} className="btn-secondary">
          Export PDF (corrigé)
        </button>
        {isDraft ? (
          <button type="button" onClick={handlePublish} disabled={saving} className="btn-primary">
            Publier le quiz
          </button>
        ) : (
          <Link to={`/quiz/${quiz.id}`} className="btn-primary">
            Passer le quiz
          </Link>
        )}
        {!isDraft && className && (
          <Link to={`/teacher/engagement?class=${encodeURIComponent(className)}`} className="btn-secondary">
            Voir engagement classe
          </Link>
        )}
      </div>
    </div>
  );
}

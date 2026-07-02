import { api } from './client';

export type Question = {
  index: number;
  prompt: string;
  options: string[];
  correct_index: number;
};

export type QuizStatus = 'draft' | 'published';

export type Quiz = {
  id: number;
  title: string;
  source_text: string;
  status: QuizStatus;
  subject: string;
  class_name: string;
  score: number | null;
  created_at: string;
  questions: Question[];
};

export type QuizSummary = {
  id: number;
  title: string;
  status: QuizStatus;
  subject: string;
  class_name: string;
  score: number | null;
  nb_questions: number;
  created_at: string;
};

type PaginatedQuizzes = {
  count: number;
  next: string | null;
  previous: string | null;
  results: QuizSummary[];
};

export type QuizFilters = {
  subject?: string;
  class_name?: string;
  status?: QuizStatus;
};

export type AnswerDetail = {
  index: number;
  selected_index: number;
  correct_index: number;
  correct: boolean;
};

export type AnswerResult = {
  score: number;
  total: number;
  details: AnswerDetail[];
};

export type ClassEngagement = {
  class_name: string;
  my_quizzes: number;
  published_quizzes: number;
  students_participated: number;
  average_class_score: number | null;
  quizzes: {
    id: number;
    title: string;
    subject: string;
    status: QuizStatus;
    attempts: number;
    average_score: number | null;
  }[];
};

export async function listQuizzes(filters?: QuizFilters): Promise<PaginatedQuizzes> {
  const params = new URLSearchParams();
  if (filters?.subject) params.set('subject', filters.subject);
  if (filters?.class_name) params.set('class_name', filters.class_name);
  if (filters?.status) params.set('status', filters.status);
  const qs = params.toString();
  const { data } = await api.get<PaginatedQuizzes>(`/quizzes/${qs ? `?${qs}` : ''}`);
  return data;
}

export async function getQuiz(id: number): Promise<Quiz> {
  const { data } = await api.get<Quiz>(`/quizzes/${id}/`);
  return data;
}

export async function updateQuizMeta(
  id: number,
  meta: { title?: string; subject?: string; class_name?: string },
): Promise<Quiz> {
  const { data } = await api.patch<Quiz>(`/quizzes/${id}/meta/`, meta);
  return data;
}

export async function updateQuestion(
  quizId: number,
  questionIndex: number,
  patch: { prompt?: string; options?: string[]; correct_index?: number },
): Promise<Quiz> {
  const { data } = await api.patch<Quiz>(`/quizzes/${quizId}/questions/${questionIndex}/`, patch);
  return data;
}

export async function publishQuiz(id: number): Promise<Quiz> {
  const { data } = await api.post<Quiz>(`/quizzes/${id}/publish/`);
  return data;
}

export async function exportQuizPdf(id: number, withAnswers = false): Promise<Blob> {
  const { data } = await api.get<Blob>(`/quizzes/${id}/export-pdf/`, {
    params: withAnswers ? { answers: '1' } : undefined,
    responseType: 'blob',
  });
  return data;
}

export async function getClassEngagement(className: string): Promise<ClassEngagement> {
  const { data } = await api.get<ClassEngagement>('/quizzes/class-engagement/', {
    params: { class_name: className },
  });
  return data;
}

export async function submitAnswers(
  quizId: number,
  answers: { index: number; selected_index: number }[],
): Promise<AnswerResult> {
  const { data } = await api.post<AnswerResult>(`/quizzes/${quizId}/answer/`, { answers });
  return data;
}

// ---------------------------------------------------------------------------
// MVP2 (Lot 6) — Dashboard de progression & Révision des erreurs
// ---------------------------------------------------------------------------

export type ScorePoint = {
  id: number;
  title: string;
  score: number;
  created_at: string;
};

export type Stats = {
  total_quizzes: number;
  quizzes_taken: number;
  average_score: number | null;
  best_score: number | null;
  last_score: number | null;
  questions_answered: number;
  questions_correct: number;
  accuracy: number | null;
  history: ScorePoint[];
};

export type Mistake = {
  quiz_id: number;
  quiz_title: string;
  index: number;
  prompt: string;
  options: string[];
  correct_index: number;
  selected_index: number;
};

export async function getStats(): Promise<Stats> {
  const { data } = await api.get<Stats>('/quizzes/stats/');
  return data;
}

export async function getMistakes(): Promise<{ count: number; mistakes: Mistake[] }> {
  const { data } = await api.get<{ count: number; mistakes: Mistake[] }>('/quizzes/mistakes/');
  return data;
}

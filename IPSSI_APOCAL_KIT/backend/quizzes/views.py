"""
Endpoints quizz :
    GET   /api/quizzes/                      — historique du user connecté
    GET   /api/quizzes/<id>/                 — détail (avec les 10 questions)
    PATCH /api/quizzes/<id>/                 — métadonnées (matière, classe) — US-15
    POST  /api/quizzes/<id>/publish/         — publier après relecture — US-13
    GET   /api/quizzes/<id>/export-pdf/      — export PDF — US-14
    PATCH /api/quizzes/<id>/questions/<idx>/ — éditer une question — US-13
    POST  /api/quizzes/<id>/answer/          — soumet 10 réponses, renvoie le score
    GET   /api/quizzes/class-engagement/     — suivi engagement classe — US-16
"""

from django.db.models import Avg, Count, F, Max
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import OpenApiResponse, extend_schema
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Question, Quiz
from .pdf_export import build_quiz_pdf
from .serializers import (
    QuestionUpdateSerializer,
    QuizMetaSerializer,
    QuizSerializer,
    QuizSummarySerializer,
    SubmitAnswersSerializer,
)


class QuizListView(generics.ListAPIView):
    """Historique des quizz du user connecté."""

    serializer_class = QuizSummarySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = Quiz.objects.filter(user=self.request.user).order_by("-created_at")
        subject = self.request.query_params.get("subject")
        class_name = self.request.query_params.get("class_name")
        quiz_status = self.request.query_params.get("status")
        if subject:
            qs = qs.filter(subject__iexact=subject.strip())
        if class_name:
            qs = qs.filter(class_name__iexact=class_name.strip())
        if quiz_status in Quiz.Status.values:
            qs = qs.filter(status=quiz_status)
        return qs

    @extend_schema(description="Liste paginée des quizz de l'utilisateur connecté (filtres US-15).")
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class QuizDetailView(generics.RetrieveAPIView):
    """Détail d'un quiz (les 10 questions complètes)."""

    serializer_class = QuizSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Quiz.objects.filter(user=self.request.user)


class QuizMetaUpdateView(APIView):
    """Met à jour titre, matière et classe (US-15)."""

    permission_classes = [IsAuthenticated]

    @extend_schema(request=QuizMetaSerializer, responses={200: QuizSerializer})
    def patch(self, request, pk: int):
        quiz = get_object_or_404(Quiz, pk=pk, user=request.user)
        serializer = QuizMetaSerializer(quiz, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(QuizSerializer(quiz).data)


class QuestionUpdateView(APIView):
    """Édite une question avant publication (US-13)."""

    permission_classes = [IsAuthenticated]

    @extend_schema(request=QuestionUpdateSerializer, responses={200: QuizSerializer})
    def patch(self, request, pk: int, question_index: int):
        quiz = get_object_or_404(Quiz, pk=pk, user=request.user)
        if quiz.status != Quiz.Status.DRAFT:
            return Response(
                {"detail": "Seuls les quiz en brouillon peuvent être modifiés."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        question = get_object_or_404(Question, quiz=quiz, index=question_index)
        serializer = QuestionUpdateSerializer(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        if "prompt" in data:
            question.prompt = data["prompt"]
        if "options" in data:
            question.options = data["options"]
        if "correct_index" in data:
            question.correct_index = data["correct_index"]
        question.save()
        quiz.refresh_from_db()
        return Response(QuizSerializer(quiz).data)


class PublishQuizView(APIView):
    """Publie un quiz après relecture enseignante (US-13)."""

    permission_classes = [IsAuthenticated]

    @extend_schema(responses={200: QuizSerializer})
    def post(self, request, pk: int):
        quiz = get_object_or_404(Quiz, pk=pk, user=request.user)
        if quiz.questions.count() != 10:
            return Response(
                {"detail": "Le quiz doit contenir 10 questions avant publication."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        quiz.status = Quiz.Status.PUBLISHED
        quiz.save(update_fields=["status", "updated_at"])
        return Response(QuizSerializer(quiz).data)


class ExportQuizPdfView(APIView):
    """Export PDF mis en page (US-14)."""

    permission_classes = [IsAuthenticated]

    @extend_schema(responses={200: OpenApiResponse(description="Fichier PDF")})
    def get(self, request, pk: int):
        quiz = get_object_or_404(Quiz, pk=pk, user=request.user)
        with_answers = request.query_params.get("answers") == "1"
        pdf_bytes = build_quiz_pdf(quiz, with_answers=with_answers)
        filename = f"quiz-{quiz.id}.pdf"
        response = HttpResponse(pdf_bytes, content_type="application/pdf")
        response["Content-Disposition"] = f'attachment; filename="{filename}"'
        return response


class ClassEngagementView(APIView):
    """Suivi d'engagement par classe (US-16)."""

    permission_classes = [IsAuthenticated]

    @extend_schema(responses={200: OpenApiResponse(description="KPIs engagement classe")})
    def get(self, request):
        class_name = (request.query_params.get("class_name") or "").strip()
        if not class_name:
            return Response(
                {"detail": "Paramètre class_name requis."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        teacher_quizzes = Quiz.objects.filter(
            user=request.user,
            class_name__iexact=class_name,
        )
        published = teacher_quizzes.filter(status=Quiz.Status.PUBLISHED)
        student_quizzes = (
            Quiz.objects.filter(class_name__iexact=class_name, score__isnull=False)
            .exclude(user=request.user)
            .select_related("user")
        )
        agg = student_quizzes.aggregate(avg=Avg("score"), participants=Count("user", distinct=True))

        quiz_rows = []
        for q in published.order_by("-created_at"):
            related_scores = student_quizzes.filter(title=q.title)
            quiz_rows.append(
                {
                    "id": q.id,
                    "title": q.title,
                    "subject": q.subject,
                    "status": q.status,
                    "attempts": related_scores.count(),
                    "average_score": round(related_scores.aggregate(a=Avg("score"))["a"] or 0, 1)
                    if related_scores.exists()
                    else None,
                }
            )

        return Response(
            {
                "class_name": class_name,
                "my_quizzes": teacher_quizzes.count(),
                "published_quizzes": published.count(),
                "students_participated": agg["participants"] or 0,
                "average_class_score": round(agg["avg"], 1) if agg["avg"] is not None else None,
                "quizzes": quiz_rows,
            }
        )


class AnswerQuizView(APIView):
    """Reçoit 10 réponses, calcule le score, met à jour le quiz."""

    permission_classes = [IsAuthenticated]

    @extend_schema(
        request=SubmitAnswersSerializer,
        responses={200: OpenApiResponse(description="{ score, total, details }")},
        description=(
            "Soumet les 10 réponses et reçoit le détail de la correction. "
            "Le score est persisté sur le quiz."
        ),
    )
    def post(self, request, pk: int):
        quiz = get_object_or_404(Quiz, pk=pk, user=request.user)
        if quiz.status != Quiz.Status.PUBLISHED:
            return Response(
                {"detail": "Ce quiz n'est pas encore publié."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = SubmitAnswersSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        answers = serializer.validated_data["answers"]

        questions_by_idx = {q.index: q for q in quiz.questions.all()}
        if len(questions_by_idx) != 10:
            return Response(
                {"detail": "Ce quiz n'a pas 10 questions — état incohérent."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        details = []
        score = 0
        for ans in answers:
            q = questions_by_idx[ans["index"]]
            correct = q.correct_index == ans["selected_index"]
            if correct:
                score += 1
            q.selected_index = ans["selected_index"]
            q.save(update_fields=["selected_index"])
            details.append(
                {
                    "index": ans["index"],
                    "selected_index": ans["selected_index"],
                    "correct_index": q.correct_index,
                    "correct": correct,
                }
            )

        quiz.score = score
        quiz.save(update_fields=["score", "updated_at"])

        return Response(
            {
                "score": score,
                "total": 10,
                "details": details,
            }
        )


class StatsView(APIView):
    """Statistiques de progression de l'utilisateur connecté."""

    permission_classes = [IsAuthenticated]

    @extend_schema(responses={200: OpenApiResponse(description="KPIs + historique des scores")})
    def get(self, request):
        quizzes = Quiz.objects.filter(user=request.user)
        taken = quizzes.filter(score__isnull=False)

        agg = taken.aggregate(avg=Avg("score"), best=Max("score"), nb=Count("id"))
        nb_taken = agg["nb"] or 0

        answered = Question.objects.filter(quiz__user=request.user, selected_index__isnull=False)
        nb_answered = answered.count()
        nb_correct = answered.filter(selected_index=F("correct_index")).count()

        history = [
            {
                "id": q.id,
                "title": q.title,
                "score": q.score,
                "created_at": q.created_at,
            }
            for q in taken.order_by("created_at")
        ]

        return Response(
            {
                "total_quizzes": quizzes.count(),
                "quizzes_taken": nb_taken,
                "average_score": round(agg["avg"], 1) if agg["avg"] is not None else None,
                "best_score": agg["best"],
                "last_score": history[-1]["score"] if history else None,
                "questions_answered": nb_answered,
                "questions_correct": nb_correct,
                "accuracy": round(100 * nb_correct / nb_answered) if nb_answered else None,
                "history": history,
            }
        )


class MistakesView(APIView):
    """Liste les questions ratées (dernière réponse incorrecte) de l'utilisateur."""

    permission_classes = [IsAuthenticated]

    @extend_schema(responses={200: OpenApiResponse(description="Liste des questions ratées")})
    def get(self, request):
        wrong = (
            Question.objects.filter(quiz__user=request.user, selected_index__isnull=False)
            .exclude(selected_index=F("correct_index"))
            .select_related("quiz")
            .order_by("-quiz__created_at", "index")
        )
        items = [
            {
                "quiz_id": q.quiz_id,
                "quiz_title": q.quiz.title,
                "index": q.index,
                "prompt": q.prompt,
                "options": q.options,
                "correct_index": q.correct_index,
                "selected_index": q.selected_index,
            }
            for q in wrong
        ]
        return Response({"count": len(items), "mistakes": items})

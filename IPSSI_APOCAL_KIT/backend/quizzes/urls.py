from django.urls import path

from .views import (
    AnswerQuizView,
    ClassEngagementView,
    ExportQuizPdfView,
    MistakesView,
    PublishQuizView,
    QuestionUpdateView,
    QuizDetailView,
    QuizListView,
    QuizMetaUpdateView,
    StatsView,
)

urlpatterns = [
    path("", QuizListView.as_view(), name="quiz-list"),
    path("stats/", StatsView.as_view(), name="quiz-stats"),
    path("mistakes/", MistakesView.as_view(), name="quiz-mistakes"),
    path("class-engagement/", ClassEngagementView.as_view(), name="quiz-class-engagement"),
    path("<int:pk>/", QuizDetailView.as_view(), name="quiz-detail"),
    path("<int:pk>/meta/", QuizMetaUpdateView.as_view(), name="quiz-meta"),
    path("<int:pk>/publish/", PublishQuizView.as_view(), name="quiz-publish"),
    path("<int:pk>/export-pdf/", ExportQuizPdfView.as_view(), name="quiz-export-pdf"),
    path(
        "<int:pk>/questions/<int:question_index>/",
        QuestionUpdateView.as_view(),
        name="quiz-question-update",
    ),
    path("<int:pk>/answer/", AnswerQuizView.as_view(), name="quiz-answer"),
]

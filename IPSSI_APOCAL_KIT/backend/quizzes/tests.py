"""Tests pour l'app quizzes — K1 (list/detail) + K2 (answer)."""

import pytest
from django.contrib.auth.models import User
from rest_framework.test import APIClient

from .models import Question, Quiz

pytestmark = pytest.mark.django_db


@pytest.fixture
def user() -> User:
    return User.objects.create_user(username="alice", password="motdepasse123")


@pytest.fixture
def other_user() -> User:
    return User.objects.create_user(username="bob", password="motdepasse123")


@pytest.fixture
def auth_client(user) -> APIClient:
    client = APIClient()
    client.force_authenticate(user=user)
    return client


@pytest.fixture
def sample_quiz(user) -> Quiz:
    quiz = Quiz.objects.create(
        user=user,
        title="Cours de test",
        source_text="Lorem ipsum dolor sit amet.",
        score=None,
        status=Quiz.Status.PUBLISHED,
    )
    for i in range(1, 11):
        Question.objects.create(
            quiz=quiz,
            index=i,
            prompt=f"Question {i} ?",
            options=["A", "B", "C", "D"],
            correct_index=0,  # bonne réponse = A pour toutes
        )
    return quiz


def test_quiz_list_requires_auth():
    response = APIClient().get("/api/quizzes/")
    assert response.status_code in (401, 403)


def test_quiz_list_returns_user_quizzes(auth_client, sample_quiz):
    response = auth_client.get("/api/quizzes/")
    assert response.status_code == 200
    assert response.data["count"] == 1
    assert response.data["results"][0]["nb_questions"] == 10


def test_quiz_list_does_not_leak_other_users_quizzes(auth_client, other_user):
    Quiz.objects.create(user=other_user, title="Quiz de Bob", source_text="...")
    response = auth_client.get("/api/quizzes/")
    assert response.data["count"] == 0


def test_quiz_detail(auth_client, sample_quiz):
    response = auth_client.get(f"/api/quizzes/{sample_quiz.id}/")
    assert response.status_code == 200
    assert len(response.data["questions"]) == 10


def test_quiz_detail_404_for_other_users_quiz(auth_client, other_user):
    other_quiz = Quiz.objects.create(user=other_user, title="Privé", source_text="...")
    response = auth_client.get(f"/api/quizzes/{other_quiz.id}/")
    assert response.status_code == 404


# --- K2 : answer endpoint ---


def test_answer_all_correct(auth_client, sample_quiz):
    """Toutes les bonnes réponses (= 0 partout) → score 10/10."""
    response = auth_client.post(
        f"/api/quizzes/{sample_quiz.id}/answer/",
        {"answers": [{"index": i, "selected_index": 0} for i in range(1, 11)]},
        format="json",
    )
    assert response.status_code == 200, response.data
    assert response.data["score"] == 10
    assert response.data["total"] == 10
    assert all(d["correct"] for d in response.data["details"])
    sample_quiz.refresh_from_db()
    assert sample_quiz.score == 10


def test_answer_all_wrong(auth_client, sample_quiz):
    response = auth_client.post(
        f"/api/quizzes/{sample_quiz.id}/answer/",
        {"answers": [{"index": i, "selected_index": 1} for i in range(1, 11)]},
        format="json",
    )
    assert response.data["score"] == 0


def test_answer_partial(auth_client, sample_quiz):
    """5 bonnes + 5 mauvaises."""
    answers = [{"index": i, "selected_index": 0} for i in range(1, 6)] + [
        {"index": i, "selected_index": 1} for i in range(6, 11)
    ]
    response = auth_client.post(
        f"/api/quizzes/{sample_quiz.id}/answer/",
        {"answers": answers},
        format="json",
    )
    assert response.data["score"] == 5


def test_answer_requires_10(auth_client, sample_quiz):
    response = auth_client.post(
        f"/api/quizzes/{sample_quiz.id}/answer/",
        {"answers": [{"index": 1, "selected_index": 0}]},
        format="json",
    )
    assert response.status_code == 400


def test_answer_404_for_other_users_quiz(auth_client, other_user):
    other_quiz = Quiz.objects.create(user=other_user, title="Privé", source_text="...")
    for i in range(1, 11):
        Question.objects.create(
            quiz=other_quiz,
            index=i,
            prompt=f"Q{i}",
            options=["A", "B", "C", "D"],
            correct_index=0,
        )
    response = auth_client.post(
        f"/api/quizzes/{other_quiz.id}/answer/",
        {"answers": [{"index": i, "selected_index": 0} for i in range(1, 11)]},
        format="json",
    )
    assert response.status_code == 404


# --- R2 enseignante (US-13 à US-16) ---


def test_draft_quiz_cannot_be_answered(auth_client, user):
    quiz = Quiz.objects.create(
        user=user,
        title="Brouillon",
        source_text="...",
        status=Quiz.Status.DRAFT,
    )
    for i in range(1, 11):
        Question.objects.create(
            quiz=quiz,
            index=i,
            prompt=f"Q{i}",
            options=["A", "B", "C", "D"],
            correct_index=0,
        )
    response = auth_client.post(
        f"/api/quizzes/{quiz.id}/answer/",
        {"answers": [{"index": i, "selected_index": 0} for i in range(1, 11)]},
        format="json",
    )
    assert response.status_code == 400


def test_edit_question_in_draft(auth_client, user):
    quiz = Quiz.objects.create(
        user=user,
        title="Brouillon",
        source_text="...",
        status=Quiz.Status.DRAFT,
    )
    Question.objects.create(
        quiz=quiz,
        index=1,
        prompt="Avant",
        options=["A", "B", "C", "D"],
        correct_index=0,
    )
    for i in range(2, 11):
        Question.objects.create(
            quiz=quiz,
            index=i,
            prompt=f"Q{i}",
            options=["A", "B", "C", "D"],
            correct_index=0,
        )
    response = auth_client.patch(
        f"/api/quizzes/{quiz.id}/questions/1/",
        {"prompt": "Après édition"},
        format="json",
    )
    assert response.status_code == 200
    assert response.data["questions"][0]["prompt"] == "Après édition"


def test_publish_quiz(auth_client, user):
    quiz = Quiz.objects.create(
        user=user,
        title="Brouillon",
        source_text="...",
        status=Quiz.Status.DRAFT,
    )
    for i in range(1, 11):
        Question.objects.create(
            quiz=quiz,
            index=i,
            prompt=f"Q{i}",
            options=["A", "B", "C", "D"],
            correct_index=0,
        )
    response = auth_client.post(f"/api/quizzes/{quiz.id}/publish/")
    assert response.status_code == 200
    assert response.data["status"] == "published"


def test_export_pdf(auth_client, sample_quiz):
    response = auth_client.get(f"/api/quizzes/{sample_quiz.id}/export-pdf/")
    assert response.status_code == 200
    assert response["Content-Type"] == "application/pdf"
    assert response.content[:4] == b"%PDF"


def test_filter_by_subject(auth_client, user):
    Quiz.objects.create(
        user=user,
        title="Com",
        source_text="...",
        subject="Communication",
        status=Quiz.Status.PUBLISHED,
    )
    Quiz.objects.create(
        user=user,
        title="Hist",
        source_text="...",
        subject="Histoire",
        status=Quiz.Status.PUBLISHED,
    )
    response = auth_client.get("/api/quizzes/?subject=Communication")
    assert response.data["count"] == 1
    assert response.data["results"][0]["title"] == "Com"


def test_class_engagement(auth_client, user, other_user):
    Quiz.objects.create(
        user=user,
        title="Quiz classe",
        source_text="...",
        class_name="BTS Com 1A",
        status=Quiz.Status.PUBLISHED,
    )
    Quiz.objects.create(
        user=other_user,
        title="Quiz classe",
        source_text="...",
        class_name="BTS Com 1A",
        score=8,
        status=Quiz.Status.PUBLISHED,
    )
    response = auth_client.get("/api/quizzes/class-engagement/?class_name=BTS+Com+1A")
    assert response.status_code == 200
    assert response.data["students_participated"] == 1
    assert response.data["published_quizzes"] == 1

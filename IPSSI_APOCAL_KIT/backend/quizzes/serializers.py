"""Sérialiseurs pour Quiz et Question."""

from rest_framework import serializers

from .models import Question, Quiz


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ["index", "prompt", "options", "correct_index"]


class QuestionUpdateSerializer(serializers.Serializer):
    prompt = serializers.CharField(required=False)
    options = serializers.ListField(child=serializers.CharField(), min_length=4, max_length=4, required=False)
    correct_index = serializers.IntegerField(min_value=0, max_value=3, required=False)


class QuestionPublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ["index", "prompt", "options"]


class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Quiz
        fields = [
            "id",
            "title",
            "source_text",
            "status",
            "subject",
            "class_name",
            "score",
            "created_at",
            "questions",
        ]
        read_only_fields = ["id", "created_at"]


class QuizMetaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = ["title", "subject", "class_name"]


class QuizSummarySerializer(serializers.ModelSerializer):
    nb_questions = serializers.SerializerMethodField()

    class Meta:
        model = Quiz
        fields = [
            "id",
            "title",
            "status",
            "subject",
            "class_name",
            "score",
            "nb_questions",
            "created_at",
        ]

    def get_nb_questions(self, obj: Quiz) -> int:
        return obj.questions.count()


class AnswerItemSerializer(serializers.Serializer):
    index = serializers.IntegerField(min_value=1, max_value=10)
    selected_index = serializers.IntegerField(min_value=0, max_value=3)


class SubmitAnswersSerializer(serializers.Serializer):
    answers = AnswerItemSerializer(many=True)

    def validate_answers(self, value):
        if len(value) != 10:
            raise serializers.ValidationError(f"10 réponses attendues, {len(value)} reçues.")
        indices = sorted(a["index"] for a in value)
        if indices != list(range(1, 11)):
            raise serializers.ValidationError("Les indices doivent couvrir 1..10 sans doublon.")
        return value

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("quizzes", "0002_question_selected_index"),
    ]

    operations = [
        migrations.AddField(
            model_name="quiz",
            name="class_name",
            field=models.CharField(
                blank=True,
                default="",
                help_text="Classe / cohorte (ex. BTS Com 1A) — US-15 / US-16.",
                max_length=100,
            ),
        ),
        migrations.AddField(
            model_name="quiz",
            name="status",
            field=models.CharField(
                choices=[("draft", "Brouillon"), ("published", "Publié")],
                default="draft",
                help_text="Brouillon (relecture enseignante) ou publié (passage élève).",
                max_length=20,
            ),
        ),
        migrations.AddField(
            model_name="quiz",
            name="subject",
            field=models.CharField(
                blank=True,
                default="",
                help_text="Matière (ex. Communication) — US-15.",
                max_length=100,
            ),
        ),
    ]

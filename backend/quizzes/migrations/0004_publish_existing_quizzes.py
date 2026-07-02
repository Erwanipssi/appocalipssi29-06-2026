from django.db import migrations


def publish_existing_quizzes(apps, schema_editor):
    Quiz = apps.get_model("quizzes", "Quiz")
    Quiz.objects.filter(status="draft").update(status="published")


class Migration(migrations.Migration):
    dependencies = [
        ("quizzes", "0003_quiz_teacher_r2_fields"),
    ]

    operations = [
        migrations.RunPython(publish_existing_quizzes, migrations.RunPython.noop),
    ]

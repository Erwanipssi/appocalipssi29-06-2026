"""Export PDF d'un quiz (US-14)."""

import io

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer

from .models import Quiz


def build_quiz_pdf(quiz: Quiz, *, with_answers: bool = False) -> bytes:
    """Génère un PDF mis en page pour distribution ou correction enseignante."""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, leftMargin=2 * cm, rightMargin=2 * cm)
    styles = getSampleStyleSheet()
    story = []

    meta = [f"<b>{quiz.title}</b>"]
    if quiz.subject:
        meta.append(f"Matière : {quiz.subject}")
    if quiz.class_name:
        meta.append(f"Classe : {quiz.class_name}")
    story.append(Paragraph("<br/>".join(meta), styles["Title"]))
    story.append(Spacer(1, 0.5 * cm))

    for q in quiz.questions.all():
        story.append(Paragraph(f"<b>Q{q.index}.</b> {q.prompt}", styles["Heading3"]))
        for i, opt in enumerate(q.options):
            letter = chr(65 + i)
            suffix = ""
            if with_answers and i == q.correct_index:
                suffix = " ✓"
            story.append(Paragraph(f"{letter}. {opt}{suffix}", styles["Normal"]))
        story.append(Spacer(1, 0.3 * cm))

    doc.build(story)
    return buffer.getvalue()

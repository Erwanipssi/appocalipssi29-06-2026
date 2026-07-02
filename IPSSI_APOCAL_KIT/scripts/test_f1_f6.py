#!/usr/bin/env python3
"""Tests fonctionnels F1–F6 (exécuter dans le conteneur backend)."""

from __future__ import annotations

import io
import json
import sys
import uuid

import requests

BASE = "http://localhost:8000/api"
RESULTS: list[dict] = []


def record(fid: str, name: str, ok: bool, detail: str = "") -> None:
    RESULTS.append({"id": fid, "name": name, "ok": ok, "detail": detail})
    status = "OK" if ok else "FAIL"
    print(f"[{status}] {fid} — {name}" + (f" — {detail}" if detail else ""))


def auth_headers(token: str) -> dict:
    return {"Authorization": f"Token {token}"}


def main() -> int:
    suffix = uuid.uuid4().hex[:8]
    email = f"audit-{suffix}@apocal.local"
    password = "motdepasse123"
    new_password = "nouveau123456"

    # --- F1 : Inscription / connexion ---
    r = requests.post(
        f"{BASE}/accounts/signup/",
        json={"email": email, "password": password, "first_name": "Audit", "last_name": "Test"},
        timeout=30,
    )
    record("F1.1", "Inscription par email", r.status_code == 201, f"HTTP {r.status_code}")

    r = requests.post(
        f"{BASE}/accounts/login/",
        json={"email": email, "password": password},
        timeout=30,
    )
    ok_login = r.status_code == 200 and "token" in r.json()
    token = r.json().get("token", "") if ok_login else ""
    record("F1.2", "Connexion par email", ok_login)

    r = requests.get(f"{BASE}/accounts/me/", headers=auth_headers(token), timeout=30)
    record(
        "F1.3",
        "Session utilisateur (/me/)",
        r.status_code == 200 and r.json().get("email") == email,
    )

    # Validation email (token signé)
    from accounts.tokens import make_email_verify_token
    from django.contrib.auth.models import User

    user = User.objects.get(email=email)
    verify_token = make_email_verify_token(user)
    r = requests.post(
        f"{BASE}/accounts/verify-email/",
        json={"token": verify_token},
        headers=auth_headers(token),
        timeout=30,
    )
    record("F1.4", "Validation email (lien/token)", r.status_code == 200, r.text[:120])

    # Mot de passe oublié
    r = requests.post(
        f"{BASE}/accounts/password-reset/",
        json={"email": email},
        timeout=30,
    )
    record("F1.5", "Demande reset mot de passe", r.status_code == 200)

    from accounts.tokens import make_password_reset_tokens

    uid, reset_token = make_password_reset_tokens(user)
    r = requests.post(
        f"{BASE}/accounts/password-reset/confirm/",
        json={"uid": uid, "token": reset_token, "new_password": new_password},
        timeout=30,
    )
    record("F1.6", "Confirmation reset mot de passe", r.status_code == 200, r.text[:120])

    r = requests.post(
        f"{BASE}/accounts/login/",
        json={"email": email, "password": new_password},
        timeout=30,
    )
    token = r.json().get("token", token)
    record("F1.7", "Connexion avec nouveau mot de passe", r.status_code == 200)

    r = requests.patch(
        f"{BASE}/accounts/profile/",
        json={"first_name": "Audit2", "last_name": "Profil"},
        headers=auth_headers(token),
        timeout=30,
    )
    record(
        "F1.8",
        "Page profil (PATCH /profile/)",
        r.status_code == 200 and r.json().get("first_name") == "Audit2",
    )

    # --- F2 : Saisie cours ---
    short = requests.post(
        f"{BASE}/llm/generate-quiz/",
        headers=auth_headers(token),
        data={"title": "Trop court", "source_text": "court"},
        timeout=30,
    )
    record(
        "F2.1",
        "Texte < 200 car. refusé",
        short.status_code == 400,
        short.text[:100],
    )

    long_text = (
        "La Revolution francaise debute en 1789. " * 12
    )  # > 200 chars
    r = requests.post(
        f"{BASE}/llm/generate-quiz/",
        headers=auth_headers(token),
        data={"title": "Cours texte audit", "source_text": long_text},
        timeout=600,
    )
    record(
        "F2.2",
        "Saisie texte >= 200 car. acceptée",
        r.status_code == 201,
        f"HTTP {r.status_code}",
    )

    # PDF valide minimal avec texte extractible
    pdf_bytes = b"""%PDF-1.4
1 0 obj<< /Type /Catalog /Pages 2 0 R >>endobj
2 0 obj<< /Type /Pages /Kids [3 0 R] /Count 1 >>endobj
3 0 obj<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources<< /Font<< /F1 5 0 R >> >> >>endobj
4 0 obj<< /Length 120 >>stream
BT /F1 12 Tf 72 720 Td (Revolution francaise 1789 Bastille Robespierre Terreur Napoleon droits homme republic.) Tj ET
endstream endobj
5 0 obj<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000267 00000 n 
0000000440 00000 n 
trailer<< /Size 6 /Root 1 0 R >>
startxref
519
%%EOF"""

    r = requests.post(
        f"{BASE}/llm/generate-quiz/",
        headers=auth_headers(token),
        files={"pdf": ("cours.pdf", pdf_bytes, "application/pdf")},
        data={"title": "Cours PDF audit"},
        timeout=600,
    )
    record("F2.3", "Upload PDF accepté", r.status_code == 201, f"HTTP {r.status_code}")

    big_pdf = b"%PDF-1.4\n" + (b"0" * (5 * 1024 * 1024 + 1))
    r = requests.post(
        f"{BASE}/llm/generate-quiz/",
        headers=auth_headers(token),
        files={"pdf": ("big.pdf", big_pdf, "application/pdf")},
        data={"title": "PDF trop gros"},
        timeout=30,
    )
    record(
        "F2.4",
        "PDF > 5 Mo refusé",
        r.status_code == 400 and "5" in r.text,
        r.text[:120],
    )

    # --- F3 : Génération 10 QCM LLM local ---
    from django.conf import settings

    ping = requests.get(f"{BASE}/llm/ping/", timeout=30).json()
    llm_local = settings.LLM_BACKEND == "ollama" and ping.get("model_loaded") is True
    record(
        "F3.0",
        "LLM local Ollama chargé",
        llm_local,
        json.dumps(ping, ensure_ascii=False)[:120],
    )

    quiz_id = None
    if r.status_code == 201:
        quiz_id = r.json().get("id")
    elif short.status_code != 201:
        gen = requests.post(
            f"{BASE}/llm/generate-quiz/",
            headers=auth_headers(token),
            data={"title": "Quiz F3", "source_text": long_text},
            timeout=600,
        )
        if gen.status_code == 201:
            quiz_id = gen.json().get("id")

    if quiz_id:
        detail = requests.get(
            f"{BASE}/quizzes/{quiz_id}/",
            headers=auth_headers(token),
            timeout=30,
        ).json()
        nb_q = len(detail.get("questions", []))
        one_correct = all(
            0 <= q.get("correct_index", -1) <= 3 for q in detail.get("questions", [])
        )
        record("F3.1", "Génération 10 QCM", nb_q == 10, f"{nb_q} questions")
        record("F3.2", "1 bonne réponse par question (index 0-3)", one_correct)
    else:
        record("F3.1", "Génération 10 QCM", False, "pas de quiz généré")
        record("F3.2", "1 bonne réponse par question", False, "N/A")

    # Utiliser le quiz texte si disponible
    quizzes = requests.get(f"{BASE}/quizzes/", headers=auth_headers(token), timeout=30).json()
    if quizzes.get("results"):
        quiz_id = quizzes["results"][0]["id"]
        detail = requests.get(
            f"{BASE}/quizzes/{quiz_id}/",
            headers=auth_headers(token),
            timeout=30,
        ).json()
    else:
        detail = {"questions": []}

    # --- F4 & F5 : Soumission + score + détail ---
    if detail.get("questions"):
        answers = [
            {"index": q["index"], "selected_index": q["correct_index"]}
            for q in detail["questions"]
        ]
        ans = requests.post(
            f"{BASE}/quizzes/{quiz_id}/answer/",
            headers=auth_headers(token),
            json={"answers": answers},
            timeout=30,
        )
        data = ans.json() if ans.status_code == 200 else {}
        record(
            "F4.1",
            "Soumission des 10 réponses",
            ans.status_code == 200,
            f"HTTP {ans.status_code}",
        )
        record(
            "F4.2",
            "Correction automatique (score calculé)",
            data.get("score") == 10 and data.get("total") == 10,
            f"score={data.get('score')}",
        )
        record(
            "F5.1",
            "Score affiché /10",
            data.get("total") == 10,
            f"{data.get('score')}/{data.get('total')}",
        )
        details_ok = (
            len(data.get("details", [])) == 10
            and all("correct" in d for d in data.get("details", []))
        )
        record("F5.2", "Détail bonnes/mauvaises réponses", details_ok)
    else:
        record("F4.1", "Soumission des 10 réponses", False, "aucun quiz")
        record("F4.2", "Correction automatique", False, "N/A")
        record("F5.1", "Score affiché /10", False, "N/A")
        record("F5.2", "Détail bonnes/mauvaises réponses", False, "N/A")

    # --- F6 : Historique persistant ---
    hist = requests.get(f"{BASE}/quizzes/", headers=auth_headers(token), timeout=30).json()
    results = hist.get("results", [])
    has_items = len(results) >= 1
    has_meta = has_items and all(
        "created_at" in q and "title" in q and "score" in q for q in results
    )
    record(
        "F6.1",
        "Historique par utilisateur",
        has_items,
        f"{len(results)} quiz",
    )
    record(
        "F6.2",
        "Historique : date + cours + score",
        has_meta,
        json.dumps(results[0], ensure_ascii=False)[:120] if results else "",
    )

    passed = sum(1 for x in RESULTS if x["ok"])
    total = len(RESULTS)
    print(f"\n=== BILAN: {passed}/{total} tests OK ===")
    print(json.dumps(RESULTS, ensure_ascii=False, indent=2))
    return 0 if passed == total else 1


if __name__ == "__main__":
    import django
    import os

    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "apocal.settings")
    django.setup()
    sys.exit(main())

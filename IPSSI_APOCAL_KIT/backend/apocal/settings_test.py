"""Settings minimalistes pour les tests locaux — remplace Postgres par SQLite."""

from apocal.settings import *  # noqa: F401, F403

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": ":memory:",
    }
}

# Désactive les emails et les logs verbiage pendant les tests
EMAIL_BACKEND = "django.core.mail.backends.locmem.EmailBackend"

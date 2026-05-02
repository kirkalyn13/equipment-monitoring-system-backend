import os
from dotenv import load_dotenv
import sys
import subprocess

load_dotenv()
DATABASE_URL = os.environ.get("DATABASE_URL", "")
DB_HOST     = os.environ.get("DB_HOST",     "")
DB_PORT     = os.environ.get("DB_PORT",     "5432")
DB_NAME     = os.environ.get("DB_NAME",     "")
DB_USER     = os.environ.get("DB_USER",     "")
DB_PASSWORD = os.environ.get("DB_PASSWORD", "")

SQL_FILE = os.path.join(os.path.dirname(__file__), "equipmentdb_postgres.sql")

def build_connection_url() -> str:
    """Resolve the database URL from env vars or components."""
    if DATABASE_URL:
        return DATABASE_URL

    if all([DB_HOST, DB_NAME, DB_USER, DB_PASSWORD]):
        return f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

    print(
        "ERROR: No database connection info found.\n"
        "Set DATABASE_URL (or DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD) "
        "as environment variables, or edit this script directly."
    )
    sys.exit(1)


def check_psql() -> None:
    """Make sure psql is available on the system."""
    result = subprocess.run(["which", "psql"], capture_output=True)
    if result.returncode != 0:
        print(
            "ERROR: psql not found. Install PostgreSQL client tools:\n"
            "  macOS:  brew install libpq && brew link --force libpq\n"
            "  Ubuntu: sudo apt install postgresql-client\n"
            "  Windows: install PostgreSQL and add bin/ to PATH"
        )
        sys.exit(1)


def run_migration(url: str) -> None:
    """Execute the SQL file against the target database."""
    if not os.path.exists(SQL_FILE):
        print(f"ERROR: SQL file not found at: {SQL_FILE}")
        sys.exit(1)

    print(f"Connecting to database...")
    print(f"Running migration from: {SQL_FILE}\n")

    result = subprocess.run(
        ["psql", url, "-f", SQL_FILE, "-v", "ON_ERROR_STOP=1"],
        capture_output=False,   # stream output live
        text=True,
    )

    if result.returncode == 0:
        print("\n✅ Migration completed successfully.")
    else:
        print(f"\n❌ Migration failed (exit code {result.returncode}).")
        sys.exit(result.returncode)


if __name__ == "__main__":
    check_psql()
    url = build_connection_url()
    run_migration(url)
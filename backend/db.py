import sqlite3
import os
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "database.db")


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            role TEXT NOT NULL,
            content TEXT NOT NULL,
            timestamp TEXT NOT NULL
        )
    """)

        # CACHE TABLE
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS ai_cache (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_message TEXT UNIQUE,
        ai_reply TEXT
    )
    """)

    conn.commit()
    conn.close()


def save_message(role, content):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO messages (role, content, timestamp)
        VALUES (?, ?, ?)
    """, (role, content, datetime.utcnow().isoformat()))

    conn.commit()
    conn.close()

def get_cached_reply(message: str):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT ai_reply FROM ai_cache WHERE user_message=?", (message,))
    row = cursor.fetchone()
    conn.close()

    return row["ai_reply"] if row else None


def save_cache(message: str, reply: str):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT OR REPLACE INTO ai_cache (user_message, ai_reply) VALUES (?, ?)",
        (message, reply)
    )

    conn.commit()
    conn.close()
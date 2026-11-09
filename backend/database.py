
import sqlite3
from pathlib import Path

# Database file location
BASE_DIR = Path(__file__).resolve().parent
DATABASE_PATH = BASE_DIR / "dropout_system.db"


def get_connection():
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")
    return connection


def initialize_database():
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            roll_number TEXT NOT NULL UNIQUE,
            course TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS assessments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER NOT NULL,
            predicted_outcome TEXT NOT NULL,
            dropout_probability REAL,
            prediction_data TEXT,
            student_data TEXT,
            counselling_recommendations TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (student_id) REFERENCES students(id)
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS admins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'admin',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    connection.commit()
    connection.close()


def register_student(name, roll_number, course):
    connection = get_connection()

    try:
        cursor = connection.cursor()

        cursor.execute("""
            INSERT INTO students (name, roll_number, course)
            VALUES (?, ?, ?)
        """, (name, roll_number, course))

        connection.commit()

        return cursor.lastrowid

    finally:
        connection.close()


def search_students(search_text):
    connection = get_connection()

    try:
        cursor = connection.cursor()

        cursor.execute("""
            SELECT id, name, roll_number, course, created_at
            FROM students
            WHERE name LIKE ? OR roll_number LIKE ?
            ORDER BY name
            LIMIT 20
        """, (f"%{search_text}%", f"%{search_text}%"))

        return [dict(row) for row in cursor.fetchall()]

    finally:
        connection.close()


def get_all_students():
    connection = get_connection()

    try:
        cursor = connection.cursor()

        cursor.execute("""
            SELECT id, name, roll_number, course, created_at
            FROM students
            ORDER BY created_at DESC
        """)

        return [dict(row) for row in cursor.fetchall()]

    finally:
        connection.close()

def get_admin_by_email(email):
    connection = get_connection()
    try:
        cursor = connection.cursor()
        cursor.execute(
            "SELECT * FROM admins WHERE email = ?",
            (email.strip().lower(),)
        )
        row = cursor.fetchone()
        return dict(row) if row else None
    finally:
        connection.close()


def create_admin(name, email, password_hash):
    connection = get_connection()
    try:
        cursor = connection.cursor()
        cursor.execute("""
            INSERT INTO admins (name, email, password_hash)
            VALUES (?, ?, ?)
        """, (name.strip(), email.strip().lower(), password_hash))
        connection.commit()
        return cursor.lastrowid
    finally:
        connection.close()


if __name__ == "__main__":
    initialize_database()
    print("SQLite database initialized successfully!")

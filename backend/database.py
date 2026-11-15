
import sqlite3
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DATABASE_PATH = BASE_DIR / "dropout_system.db"


def get_connection():
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")
    return connection


def initialize_database():
    connection = get_connection()

    try:
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

        # Safely add login fields to an existing students table.
        existing_columns = {
            row["name"]
            for row in cursor.execute(
                "PRAGMA table_info(students)"
            ).fetchall()
        }

        new_columns = {
            "email": "TEXT",
            "password_hash": "TEXT",
            "account_status": "TEXT NOT NULL DEFAULT 'active'"
        }

        for column, definition in new_columns.items():
            if column not in existing_columns:
                cursor.execute(
                    f"ALTER TABLE students ADD COLUMN {column} {definition}"
                )

        # Prevent duplicate student emails (case-insensitive).
        cursor.execute("""
            CREATE UNIQUE INDEX IF NOT EXISTS
            idx_students_email_unique
            ON students(LOWER(email))
            WHERE email IS NOT NULL
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
        print("Database initialized successfully!")

    finally:
        connection.close()


# Existing admin-created student registration.
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


# New student self-registration.
# Self-registered accounts remain pending until admin approval.
def register_student_account(
    name, roll_number, course, email, password_hash
):
    connection = get_connection()

    try:
        cursor = connection.cursor()

        cursor.execute("""
            INSERT INTO students (
                name, roll_number, course, email,
                password_hash, account_status
            )
            VALUES (?, ?, ?, ?, ?, 'pending')
        """, (
            name.strip(),
            roll_number.strip(),
            course.strip(),
            email.strip().lower(),
            password_hash
        ))

        connection.commit()
        return cursor.lastrowid

    finally:
        connection.close()


def get_student_by_email(email):
    connection = get_connection()

    try:
        cursor = connection.cursor()

        cursor.execute("""
            SELECT * FROM students
            WHERE LOWER(email) = LOWER(?)
        """, (email.strip(),))

        row = cursor.fetchone()
        return dict(row) if row else None

    finally:
        connection.close()


def get_student_by_roll_number(roll_number):
    connection = get_connection()

    try:
        cursor = connection.cursor()

        cursor.execute("""
            SELECT * FROM students
            WHERE roll_number = ?
        """, (roll_number.strip(),))

        row = cursor.fetchone()
        return dict(row) if row else None

    finally:
        connection.close()


def get_pending_students():
    connection = get_connection()

    try:
        cursor = connection.cursor()

        cursor.execute("""
            SELECT id, name, roll_number, course, email, created_at
            FROM students
            WHERE account_status = 'pending'
            ORDER BY created_at DESC
        """)

        return [dict(row) for row in cursor.fetchall()]

    finally:
        connection.close()


def update_student_status(student_id, status):
    if status not in ("active", "rejected"):
        raise ValueError("Invalid student account status")

    connection = get_connection()

    try:
        cursor = connection.cursor()

        cursor.execute("""
            UPDATE students
            SET account_status = ?
            WHERE id = ?
        """, (status, student_id))

        connection.commit()
        return cursor.rowcount > 0

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
import json


def save_student_assessment(
    student_id,
    predicted_outcome,
    dropout_probability,
    prediction_data,
    student_data,
    counselling_recommendations
):
    connection = get_connection()

    try:
        cursor = connection.cursor()

        cursor.execute("""
            INSERT INTO assessments (
                student_id,
                predicted_outcome,
                dropout_probability,
                prediction_data,
                student_data,
                counselling_recommendations
            )
            VALUES (?, ?, ?, ?, ?, ?)
        """, (
            student_id,
            predicted_outcome,
            dropout_probability,
            json.dumps(prediction_data),
            json.dumps(student_data),
            json.dumps(counselling_recommendations)
        ))

        connection.commit()
        return cursor.lastrowid

    finally:
        connection.close()


def get_assessments_by_student_id(student_id):
    connection = get_connection()

    try:
        cursor = connection.cursor()

        cursor.execute("""
            SELECT
                id,
                student_id,
                predicted_outcome,
                dropout_probability,
                prediction_data,
                counselling_recommendations,
                created_at
            FROM assessments
            WHERE student_id = ?
            ORDER BY created_at DESC
        """, (student_id,))

        results = []
        for row in cursor.fetchall():
            item = dict(row)
            item["prediction_data"] = (
                json.loads(item["prediction_data"])
                if item["prediction_data"]
                else {}
            )
            item["counselling_recommendations"] = (
                json.loads(item["counselling_recommendations"])
                if item["counselling_recommendations"]
                else []
            )
            results.append(item)

        return results

    finally:
        connection.close()
        

if __name__ == "__main__":
    initialize_database()

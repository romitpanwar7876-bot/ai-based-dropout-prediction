
import sqlite3
from getpass import getpass

from pwdlib import PasswordHash
from database import initialize_database, create_admin, get_admin_by_email

password_hasher = PasswordHash.recommended()


def main():
    initialize_database()

    print("\n--- Create Admin Account ---")

    name = input("Enter admin name: ").strip()
    email = input("Enter admin email: ").strip().lower()
    password = getpass("Enter admin password: ")
    confirm_password = getpass("Confirm admin password: ")

    if not name or not email or not password:
        print("Error: All fields are required.")
        return

    if password != confirm_password:
        print("Error: Passwords do not match.")
        return

    if len(password) < 10:
        print("Error: Password must contain at least 10 characters.")
        return

    if get_admin_by_email(email):
        print("Error: Admin email already exists.")
        return

    password_hash = password_hasher.hash(password)

    try:
        admin_id = create_admin(
            name,
            email,
            password_hash
        )

        print("\nAdmin account created successfully!")
        print("Admin ID:", admin_id)
        print("Email:", email)

    except sqlite3.IntegrityError:
        print("Error: This email is already registered.")


if __name__ == "__main__":
    main()

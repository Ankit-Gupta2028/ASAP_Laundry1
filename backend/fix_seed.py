import sys
sys.path.append('.')
import database.sqlite_db as db
from datetime import datetime

with db._get_connection() as conn:
    users = conn.execute("SELECT COUNT(*) as count FROM users").fetchone()
    if users["count"] == 0:
        seed_users = [
            ("admin1", "admin", "admin@example.com", "$pbkdf2-sha256$29000$KYVQSoWX.yBScWly6z38rxJ2V1VdfCV.xW", "admin", 1, "ADMIN123", "", datetime.utcnow().isoformat()),
            ("user1", "user", "user@example.com", "$pbkdf2-sha256$29000$KYVQSoWX.yBScWly6z38rxJ2V1VdfCV.xW", "user", 1, "EN12345", "", datetime.utcnow().isoformat())
        ]
        conn.executemany('''
            INSERT INTO users (id, username, email, password_hash, role, is_email_verified, enrollment_number, bag_number, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', seed_users)
        conn.commit()
        print("Seeded demo users.")
    else:
        print("Users already exist.")

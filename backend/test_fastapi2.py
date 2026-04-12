import sys
sys.path.append('.')
import database.supabase_db as db
from core.security import get_password_hash
from datetime import datetime, timedelta

try:
    user_data = {
        "username": "AnkitTestA1",
        "password": "password",
        "email": "ankitta1@gmail.com",
        "role": "user",
        "studentId": "123456",
        "bagNumber": "123"
    }
    user = db.db_create_user(user_data, get_password_hash("password"))
    print("User Created:", user)

    otp = "1234"
    expires_at = datetime.utcnow() + timedelta(minutes=10)
    db.db_store_otp("AnkitTestA1", otp, expires_at)
    print("OTP stored!")
except Exception as e:
    import traceback
    traceback.print_exc()

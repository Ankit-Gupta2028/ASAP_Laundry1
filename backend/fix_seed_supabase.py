import sys
import os
sys.path.append('.')
import database.supabase_db as db
from datetime import datetime

users = db._get_table("users").select("id", count="exact").execute()
if users.count == 0:
    seed_users = [
        {
            "username": "admin", 
            "email": "admin@example.com", 
            "password_hash": "$pbkdf2-sha256$29000$KYVQSoWX.yBScWly6z38rxJ2V1VdfCV.xW", 
            "role": "admin", 
            "is_email_verified": True, 
            "enrollment_number": "ADMIN123", 
            "bag_number": "", 
            "created_at": datetime.utcnow().isoformat()
        },
        {
            "username": "user", 
            "email": "user@example.com", 
            "password_hash": "$pbkdf2-sha256$29000$KYVQSoWX.yBScWly6z38rxJ2V1VdfCV.xW", 
            "role": "user", 
            "is_email_verified": True, 
            "enrollment_number": "EN12345", 
            "bag_number": "", 
            "created_at": datetime.utcnow().isoformat()
        }
    ]
    db._get_table("users").insert(seed_users).execute()
    print("Seeded Supabase users.")
else:
    print("Users already exist in Supabase.")

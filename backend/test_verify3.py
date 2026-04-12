import sys
import asyncio
from datetime import datetime
sys.path.append('.')
import database.supabase_db as db
from fastapi.testclient import TestClient
from main import app

try:
    # Insert User and OTP
    db.db_create_user({"username": "AnkitHTTPTest", "email": "test@test.com"}, "hash")
    db.db_store_otp("AnkitHTTPTest", "788775", datetime.now())
    
    # Try verifying
    client = TestClient(app)
    response = client.post("/auth/verify-otp", json={
        "username": "AnkitHTTPTest",
        "otp": "788775"
    })
    print("STATUS:", response.status_code)
except Exception as e:
    import traceback
    traceback.print_exc()

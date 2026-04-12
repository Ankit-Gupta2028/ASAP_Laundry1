import sys
sys.path.append('.')
import database.supabase_db as db
try:
    user_data = {
        "username": "Ankit97985799_new",
        "email": "ankit97985799_new@gmail.com",
        "studentId": "12345",
        "bagNumber": "12345",
        "role": "user"
    }
    user = db.db_create_user(user_data, "hash")
    print("Success:", user)
except Exception as e:
    import traceback
    traceback.print_exc()

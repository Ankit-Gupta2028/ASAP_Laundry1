import sys
sys.path.append('.')
import database.supabase_db as db
try:
    response = db._get_table("users").select("*").eq("username", "NONEXISTENT").single().execute()
    print("Success:", response)
except Exception as e:
    import traceback
    traceback.print_exc()

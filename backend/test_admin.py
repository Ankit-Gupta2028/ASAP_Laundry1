import sys
sys.path.append('.')
import database.supabase_db as db
try:
    res = db._get_table("users").select("*").eq("username", "admin").single().execute()
    print("Found:", res)
except Exception as e:
    import traceback
    traceback.print_exc()

res_all = db._get_table("users").select("username").execute()
print("All users:", res_all.data)

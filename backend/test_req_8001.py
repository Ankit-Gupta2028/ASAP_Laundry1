import urllib.request
import json
import urllib.error

url = 'http://localhost:8001/auth/register'
data = {
    "username": "testy_8001",
    "email": "testy_8001@gmail.com",
    "password": "pw"
}
req = urllib.request.Request(
    url,
    data=json.dumps(data).encode('utf-8'),
    headers={'Content-Type': 'application/json'}
)

try:
    res = urllib.request.urlopen(req)
    print("SUCCESS:", res.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print(f"HTTP ERROR {e.code}:", e.read().decode('utf-8'))
except Exception as e:
    print("OTHER ERROR:", getattr(e, 'read', lambda: str(e))())

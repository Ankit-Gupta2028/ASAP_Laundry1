from fastapi.testclient import TestClient
from main import app
import traceback

client = TestClient(app, raise_server_exceptions=True)

try:
    response = client.post(
        "/auth/register",
        json={
            "username": "testy4",
            "email": "testy4@gmail.com",
            "password": "pw"
        }
    )
    print("STATUS CODE:", response.status_code)
except Exception as e:
    print("EXCEPTION RAISED:")
    traceback.print_exc()

import asyncio
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)
response = client.post("/auth/register", json={
    "username": "Ankit97985799",
    "password": "password",
    "email": "ankit97985799@gmail.com",
    "role": "user",
    "studentId": "123456",
    "bagNumber": "123"
})
print("STATUS:", response.status_code)
print("RESPONSE:", response.json())

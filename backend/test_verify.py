import asyncio
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)
response = client.post("/auth/verify-otp", json={
    "username": "AnkitHTTPTest", # Replace with actual username if needed
    "otp": "788775"
})
print("STATUS:", response.status_code)
print("RESPONSE:", response.text)

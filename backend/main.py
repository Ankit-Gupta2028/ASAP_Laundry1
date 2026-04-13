from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings
from api.auth import router as auth_router
from api.laundry import router as laundry_router

app = FastAPI(title=settings.PROJECT_NAME)

origins = [
    "http://localhost:5173", # Vite Dev Server
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(laundry_router, prefix="/laundry", tags=["laundry"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Laundry API"}

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
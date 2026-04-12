from passlib.context import CryptContext
import secrets
import string
from core.config import settings

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def generate_otp(length=6):
    digits = string.digits
    return ''.join(secrets.choice(digits) for i in range(length))

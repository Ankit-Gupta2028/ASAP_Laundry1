from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Laundry App Backend"
    SECRET_KEY: str = "YOUR_SUPER_SECRET_KEY_HERE_REPLACE_IN_ENV"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    SMTP_EMAIL: str = "your_email@gmail.com"
    SMTP_PASSWORD_APP: str = "your_app_password_here"
    SMTP_PORT: int = 465
    SMTP_SERVER: str = "smtp.gmail.com"

    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()

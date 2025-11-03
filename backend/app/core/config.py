"""
Configuration settings for Pause application
"""

from pathlib import Path
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings"""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True
    )

    # Application
    APP_NAME: str = "Pause"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    LOG_LEVEL: str = "INFO"

    # URLs
    FRONTEND_URL: str = "http://localhost:3000"
    BACKEND_URL: str = "http://localhost:8000"

    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    # Database
    DATABASE_URL: str = "postgresql://postgres:password@localhost:5432/pause_db"

    # Security
    SECRET_KEY: str = "change-this-in-production"
    JWT_SECRET: str = "change-this-jwt-secret"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Storage
    STORAGE_TYPE: str = "local"  # 'local' or 's3'
    AWS_ACCESS_KEY_ID: str = ""
    AWS_SECRET_ACCESS_KEY: str = ""
    AWS_S3_BUCKET: str = ""
    AWS_REGION: str = "us-east-1"

    # Paths
    BASE_DIR: Path = Path(__file__).resolve().parent.parent.parent
    UPLOAD_DIR: Path = BASE_DIR / "uploads"
    STORAGE_DIR: Path = BASE_DIR / "storage"
    TEMP_DIR: Path = BASE_DIR / "tmp"

    # Video Processing
    FRAME_EXTRACTION_FPS: int = 1
    MAX_VIDEO_SIZE_MB: int = 500
    DUPLICATE_THRESHOLD: float = 0.95
    SUPPORTED_VIDEO_FORMATS: List[str] = ["mp4", "mov", "avi", "mkv", "webm"]

    # OCR Configuration
    TESSERACT_PATH: str = "/usr/bin/tesseract"
    OCR_LANGUAGES: str = "eng+kor"
    OCR_CONFIDENCE_THRESHOLD: int = 60

    # YouTube
    YOUTUBE_DL_PATH: str = "/usr/local/bin/yt-dlp"

    # AI Features
    OPENAI_API_KEY: str = ""
    ENABLE_AI_TAGGING: bool = False
    ENABLE_AI_SUMMARY: bool = False

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # Email (optional)
    SMTP_HOST: str = ""
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""

    @property
    def max_video_size_bytes(self) -> int:
        """Get max video size in bytes"""
        return self.MAX_VIDEO_SIZE_MB * 1024 * 1024

    def get_storage_path(self, user_id: int, filename: str) -> Path:
        """Get storage path for a file"""
        user_dir = self.STORAGE_DIR / f"user_{user_id}"
        user_dir.mkdir(parents=True, exist_ok=True)
        return user_dir / filename

    def get_upload_path(self, filename: str) -> Path:
        """Get upload path for a file"""
        self.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
        return self.UPLOAD_DIR / filename


# Create settings instance
settings = Settings()

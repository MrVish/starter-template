"""
Application configuration settings using python-decouple
"""
from typing import List, Optional
from decouple import config, Csv
from pydantic import BaseModel, ConfigDict

class Settings(BaseModel):
    model_config = ConfigDict(case_sensitive=True)

    # API settings
    API_V1_STR: str = config('API_V1_STR', default="/api/v1")
    PROJECT_NAME: str = config('PROJECT_NAME', default="FastAPI")
    PROJECT_DESCRIPTION: str = config('PROJECT_DESCRIPTION', default="Modern FastAPI Backend with SQLAlchemy, JWT Auth, and more")
    VERSION: str = config('VERSION', default="1.0.0")
    API_VERSION: str = VERSION  # Alias for VERSION
    
    # Security settings
    SECRET_KEY: str = config('SECRET_KEY', default="your-secret-key-change-in-production")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = config('ACCESS_TOKEN_EXPIRE_MINUTES', default=30, cast=int)
    REFRESH_TOKEN_EXPIRE_MINUTES: int = config('REFRESH_TOKEN_EXPIRE_MINUTES', default=60 * 24 * 7, cast=int)  # 7 days
    ALGORITHM: str = config('ALGORITHM', default="HS256")
    
    # CORS settings
    BACKEND_CORS_ORIGINS: List[str] = config('BACKEND_CORS_ORIGINS', default="http://localhost:3000", cast=Csv())
    
    # Database settings
    SQLALCHEMY_DATABASE_URI: str = config('SQLALCHEMY_DATABASE_URI', default="sqlite:///instance/app.db")
    DATABASE_URL: Optional[str] = config('DATABASE_URL', default=None)

    # Flask settings (for compatibility)
    FLASK_APP: Optional[str] = config('FLASK_APP', default=None)
    FLASK_ENV: Optional[str] = config('FLASK_ENV', default=None)
    FLASK_DEBUG: Optional[bool] = config('FLASK_DEBUG', default=None, cast=bool)
    
    # JWT settings
    JWT_SECRET_KEY: Optional[str] = config('JWT_SECRET_KEY', default=None)
    
    # Redis settings
    REDIS_URL: Optional[str] = config('REDIS_URL', default=None)

    # Superuser settings
    FIRST_SUPERUSER: str = config('FIRST_SUPERUSER', default="admin@example.com")
    FIRST_SUPERUSER_PASSWORD: str = config('FIRST_SUPERUSER_PASSWORD', default="admin")

settings = Settings() 
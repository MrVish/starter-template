import os
from datetime import timedelta

class Config:
    # Base configuration
    DEBUG = os.environ.get('FLASK_DEBUG', 'False') == 'True'
    TESTING = os.environ.get('FLASK_TESTING', 'False') == 'True'
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-key-change-in-production')
    
    # API Version
    API_VERSION = os.environ.get('API_VERSION', 'v1')
    
    # Database configuration
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'sqlite:///app.db')
    
    # JWT Configuration
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', SECRET_KEY)
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    # Add flexibility for NextAuth compatibility
    JWT_ALGORITHM = 'HS256'
    JWT_IDENTITY_CLAIM = 'sub'
    JWT_VERIFY_CLAIMS = ['signature', 'exp', 'iat', 'nbf']
    JWT_ERROR_MESSAGE_KEY = 'error'
    
    # OAuth Configuration
    OAUTH_CREDENTIALS = {
        'google': {
            'id': os.environ.get('GOOGLE_CLIENT_ID', ''),
            'secret': os.environ.get('GOOGLE_CLIENT_SECRET', '')
        },
        'azure': {
            'id': os.environ.get('AZURE_CLIENT_ID', ''),
            'secret': os.environ.get('AZURE_CLIENT_SECRET', ''),
            'tenant': os.environ.get('AZURE_TENANT_ID', '')
        }
    }
    
    # Cloud Storage Configuration
    CLOUD_PROVIDER = os.environ.get('CLOUD_PROVIDER', 'local')  # local, aws, gcp
    
    # AWS Configuration if using AWS
    AWS_ACCESS_KEY = os.environ.get('AWS_ACCESS_KEY', '')
    AWS_SECRET_KEY = os.environ.get('AWS_SECRET_KEY', '')
    AWS_REGION = os.environ.get('AWS_REGION', 'us-east-1')
    AWS_S3_BUCKET = os.environ.get('AWS_S3_BUCKET', '')
    
    # GCP Configuration if using GCP
    GCP_PROJECT_ID = os.environ.get('GCP_PROJECT_ID', '')
    GCP_BUCKET = os.environ.get('GCP_BUCKET', '')
    
    # File storage path for local development
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
    
    # ML Model Paths
    ML_MODELS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'ml_models')
    ML_DATASETS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'ml_datasets')
    ML_PREDICTIONS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'ml_predictions')
    ML_DRIFT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'ml_drift')
    
    # Celery Configuration
    CELERY_BROKER_URL = os.environ.get('REDIS_URL', 'redis://localhost:6379/0')
    CELERY_RESULT_BACKEND = os.environ.get('REDIS_URL', 'redis://localhost:6379/0')
    CELERY_TASK_SERIALIZER = 'json'
    CELERY_RESULT_SERIALIZER = 'json'
    CELERY_ACCEPT_CONTENT = ['json']
    CELERY_TIMEZONE = 'UTC'
    CELERY_ENABLE_UTC = True
    
    # Email Configuration
    MAIL_SERVER = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
    MAIL_PORT = int(os.environ.get('MAIL_PORT', 587))
    MAIL_USE_TLS = os.environ.get('MAIL_USE_TLS', 'True') == 'True'
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME', '')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD', '')
    MAIL_DEFAULT_SENDER = os.environ.get('MAIL_DEFAULT_SENDER', 'no-reply@example.com')
    
    # Slack Configuration
    SLACK_API_TOKEN = os.environ.get('SLACK_API_TOKEN', '')
    SLACK_ALERTS_CHANNEL = os.environ.get('SLACK_ALERTS_CHANNEL', '#alerts')
    
    # Template directory
    TEMPLATE_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'templates')


class TestConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    JWT_SECRET_KEY = 'test-key'
    CELERY_BROKER_URL = 'memory://'
    CELERY_RESULT_BACKEND = 'memory://'


class DevelopmentConfig(Config):
    DEBUG = True
    

class ProductionConfig(Config):
    DEBUG = False
    # Override with production-specific settings
    

# Configuration dictionary used by app.py
app_config = {
    'development': DevelopmentConfig,
    'testing': TestConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
} 
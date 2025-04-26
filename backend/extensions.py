"""
Shared Flask extensions and instances to avoid circular imports
"""
import logging
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_marshmallow import Marshmallow
from flask_cors import CORS

# Set up logging
logger = logging.getLogger(__name__)

# Initialize extensions
db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate()
ma = Marshmallow()

def init_extensions(app):
    """Initialize Flask extensions"""
    # Initialize CORS
    try:
        CORS(app, 
             supports_credentials=True, 
             origins=["http://localhost:3000"],
             methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
             allow_headers=["Content-Type", "Authorization", "X-Requested-With", "Accept"],
             max_age=3600)
        logger.info("CORS initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize CORS: {e}")
    
    try:
        # Initialize SQLAlchemy with a timeout to prevent indefinite waiting
        app.config.setdefault('SQLALCHEMY_ENGINE_OPTIONS', {
            'pool_recycle': 280,
            'pool_timeout': 20,
            'pool_pre_ping': True,
            'connect_args': {'connect_timeout': 10}
        })
        db.init_app(app)
        logger.info("SQLAlchemy initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize SQLAlchemy: {e}")
    
    try:
        # Initialize Flask-Migrate
        migrate.init_app(app, db)
        logger.info("Flask-Migrate initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize Flask-Migrate: {e}")
    
    try:
        # Initialize Flask-JWT-Extended
        app.config.setdefault('JWT_SECRET_KEY', app.config.get('SECRET_KEY', 'your-secret-key'))
        app.config.setdefault('JWT_ACCESS_TOKEN_EXPIRES', 900)  # 15 minutes
        app.config.setdefault('JWT_REFRESH_TOKEN_EXPIRES', 604800)  # 7 days
        jwt.init_app(app)
        logger.info("Flask-JWT-Extended initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize Flask-JWT-Extended: {e}")
    
    try:
        # Initialize Flask-Marshmallow
        ma.init_app(app)
        logger.info("Flask-Marshmallow initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize Flask-Marshmallow: {e}")
    
    # Create tables if in development mode and tables don't exist
    try:
        if app.config.get('FLASK_ENV') == 'development' or app.config.get('ENV') == 'development':
            with app.app_context():
                db.create_all()
                logger.info("Database tables created successfully")
    except Exception as e:
        logger.error(f"Failed to create database tables: {e}") 
"""
Shared Flask extensions and instances to avoid circular imports
"""
import logging
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_marshmallow import Marshmallow
from flask_cors import CORS
from flask import jsonify
import jwt

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
        # Configure CORS to allow requests from any frontend to any API endpoint
        CORS(app, 
             resources={r"/*": {
                 "origins": ["http://localhost:3000"],
                 "supports_credentials": True,
                 "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                 "allow_headers": ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
                 "expose_headers": ["Content-Type", "Authorization"],
                 "max_age": 3600
             }},
             automatic_options=True)
        
        # Remove duplicate before_request handler to prevent multiple 'Access-Control-Allow-Origin' headers
        # We'll rely solely on Flask-CORS to handle CORS properly
        
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
        # Initialize Flask-JWT-Extended with custom configurations
        app.config.setdefault('JWT_SECRET_KEY', app.config.get('SECRET_KEY', 'your-secret-key'))
        
        # Set JWT token expiration times - increase for development
        app.config.setdefault('JWT_ACCESS_TOKEN_EXPIRES', 86400)  # 24 hours for development
        app.config.setdefault('JWT_REFRESH_TOKEN_EXPIRES', 604800)  # 7 days
        
        # Other JWT settings
        app.config.setdefault('JWT_ERROR_MESSAGE_KEY', 'message')
        app.config.setdefault('JWT_BLACKLIST_ENABLED', False)
        
        # Initialize the JWT extension
        jwt.init_app(app)
        
        # Register custom handlers for JWT exceptions
        # These need to match the expected format for your flask-jwt-extended version
        
        @jwt.expired_token_loader
        def expired_token_callback(*args):
            logger.warning(f"JWT token expired: {args}")
            return jsonify({
                'success': False,
                'message': 'Token has expired',
                'error': 'token_expired',
                'data': {}
            }), 401
        
        @jwt.invalid_token_loader
        def invalid_token_callback(error_string):
            logger.warning(f"Invalid JWT token: {error_string}")
            return jsonify({
                'success': False,
                'message': error_string,
                'error': 'invalid_token',
                'data': {}
            }), 401
        
        @jwt.unauthorized_loader
        def missing_token_callback(error_string):
            logger.warning(f"Missing JWT token: {error_string}")
            return jsonify({
                'success': False,
                'message': 'Authorization required',
                'error': 'authorization_required',
                'data': {}
            }), 401
            
        # Handle raw PyJWT errors at the Flask app level (these bypass JWT-Extended)
        @app.errorhandler(jwt.exceptions.PyJWTError)
        def handle_jwt_error(e):
            logger.warning(f"JWT Error: {str(e)}")
            return jsonify({
                'success': False,
                'message': 'Token validation failed',
                'error': 'token_error',
                'data': {}
            }), 401
        
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
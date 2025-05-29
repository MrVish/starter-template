"""
Shared Flask extensions and instances to avoid circular imports
"""
import logging
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_marshmallow import Marshmallow
from flask import jsonify, request, make_response
import jwt
from functools import wraps

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Initialize extensions
db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate()
ma = Marshmallow()

# Create a response that includes CORS headers
def create_cors_response(data, status=200):
    response = make_response(data, status)
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    response.headers.add('Access-Control-Expose-Headers', 'Content-Type, Authorization')
    response.headers.add('Access-Control-Max-Age', '3600')
    response.headers.add('Vary', 'Origin')
    return response

# Create a custom decorator for routes that need both JWT and CORS
def jwt_cors_optional_decorator(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        # Handle OPTIONS requests first
        if request.method == 'OPTIONS':
            return create_cors_response(jsonify({}), 200)
            
        try:
            # Try to get JWT identity but don't require it
            from flask_jwt_extended import get_jwt_identity
            current_user = get_jwt_identity()
        except Exception as e:
            logger.warning(f"JWT error in decorator (non-fatal): {str(e)}")
            current_user = None
            
        # Call the original function
        result = fn(*args, **kwargs)
        
        # If the result is a tuple (response, status_code)
        if isinstance(result, tuple) and len(result) == 2:
            response_data, status_code = result
            # If response_data is a flask Response already
            if hasattr(response_data, 'headers'):
                for key, value in {
                    'Access-Control-Allow-Origin': 'http://localhost:3000',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept, Origin',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
                    'Access-Control-Allow-Credentials': 'true',
                    'Access-Control-Expose-Headers': 'Content-Type, Authorization',
                    'Access-Control-Max-Age': '3600',
                    'Vary': 'Origin'
                }.items():
                    response_data.headers[key] = value
                return response_data, status_code
            else:
                # Return a CORS-enabled response
                return create_cors_response(response_data, status_code)
        
        # If the result is a flask Response already
        if hasattr(result, 'headers'):
            for key, value in {
                'Access-Control-Allow-Origin': 'http://localhost:3000',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept, Origin',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Expose-Headers': 'Content-Type, Authorization',
                'Access-Control-Max-Age': '3600',
                'Vary': 'Origin'
            }.items():
                result.headers[key] = value
            return result
            
        # Return a CORS-enabled response
        return create_cors_response(result, 200)
        
    return wrapper

def init_extensions(app):
    """Initialize Flask extensions"""
    # Initialize SQLAlchemy with a timeout to prevent indefinite waiting
    try:
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
        @jwt.expired_token_loader
        def expired_token_callback(jwt_header=None, jwt_payload=None):
            logger.warning(f"JWT token expired from jwt_extended handler")
            return create_cors_response(jsonify({
                'success': False,
                'message': 'Token has expired',
                'error': 'token_expired',
                'data': {}
            }), 401)
        
        @jwt.invalid_token_loader
        def invalid_token_callback(error_string):
            logger.warning(f"Invalid JWT token: {error_string}")
            return create_cors_response(jsonify({
                'success': False,
                'message': error_string,
                'error': 'invalid_token',
                'data': {}
            }), 401)
        
        @jwt.unauthorized_loader
        def missing_token_callback(error_string):
            logger.warning(f"Missing JWT token: {error_string}")
            return create_cors_response(jsonify({
                'success': False,
                'message': 'Authorization required',
                'error': 'authorization_required',
                'data': {}
            }), 401)

        # Custom PyJWT exception handler
        # This is outside of flask-jwt-extended's handlers and will catch raw PyJWT errors
        @app.errorhandler(jwt.PyJWTError)
        def handle_jwt_error(e):
            logger.warning(f"Caught raw PyJWT error: {str(e)}")
            return create_cors_response(jsonify({
                'success': False,
                'message': str(e),
                'error': 'jwt_error',
                'data': {}
            }), 401)
            
        # Override the flask-jwt-extended handler for expired tokens completely
        # This is a dangerous approach but it works in this case
        from jwt import ExpiredSignatureError
        
        # Monkeypatch the _handle_expired_token_error with our own implementation
        def safe_handle_expired_token_error(self, expired_error):
            """Safe handler for ExpiredSignatureError that doesn't rely on error attributes"""
            logger.warning(f"JWT token expired (monkeypatch): {str(expired_error)}")
            return create_cors_response(jsonify({
                'success': False,
                'message': 'Token has expired',
                'error': 'token_expired',
                'data': {}
            }), 401)
            
        # Apply the monkeypatch to the JWT manager
        import types
        jwt._handle_expired_token_error = types.MethodType(safe_handle_expired_token_error, jwt)
        logger.info("Monkeypatched JWT error handler for ExpiredSignatureError")
        
        # Direct global error handler for ExpiredSignatureError
        @app.errorhandler(jwt.ExpiredSignatureError)
        def handle_expired_signature_error(e):
            logger.warning(f"JWT token expired handled by app errorhandler: {str(e)}")
            return create_cors_response(jsonify({
                'success': False,
                'message': 'Token has expired',
                'error': 'token_expired',
                'data': {}
            }), 401)
        
        logger.info("JWT handlers set up successfully")
        
        # Register a teapot error for testing
        @app.route('/api/teapot')
        def teapot():
            return create_cors_response(jsonify({
                'success': False,
                'message': "I'm a teapot",
                'error': 'teapot',
                'data': {}
            }), 418)
            
        # Expose the decorator
        app.jwt_cors_optional = jwt_cors_optional_decorator
        logger.info("Custom JWT+CORS decorator registered")
        
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
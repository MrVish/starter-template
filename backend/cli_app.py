"""
Special entry point for Flask CLI that ensures the blueprints
are registered with the correct URL prefixes.
"""
import os
import sys
import logging
from flask import Flask, request, Response, make_response, jsonify
from werkzeug.wrappers import Response as WerkzeugResponse
import jwt

# Set up CLI-specific logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Import extensions
from extensions import init_extensions, jwt_cors_optional_decorator

class CORSMiddleware:
    """Middleware to ensure CORS headers are added to all responses"""
    
    def __init__(self, app):
        self.app = app
        
    def __call__(self, environ, start_response):
        def custom_start_response(status, headers, exc_info=None):
            cors_headers = [
                ('Access-Control-Allow-Origin', 'http://localhost:3000'),
                ('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'),
                ('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin'),
                ('Access-Control-Allow-Credentials', 'true'),
                ('Access-Control-Expose-Headers', 'Content-Type, Authorization'),
                ('Access-Control-Max-Age', '3600'),
                ('Vary', 'Origin')
            ]
            
            # Add CORS headers to the response headers
            new_headers = []
            existing_headers = set()
            
            # Collect existing headers to avoid duplicates
            for header, value in headers:
                header_lower = header.lower()
                if not header_lower.startswith('access-control-'):
                    new_headers.append((header, value))
                    existing_headers.add(header_lower)
            
            # Add CORS headers without duplicates
            for header, value in cors_headers:
                if header.lower() not in existing_headers:
                    new_headers.append((header, value))
            
            return start_response(status, new_headers, exc_info)
        
        # Handle OPTIONS requests directly in middleware
        if environ['REQUEST_METHOD'] == 'OPTIONS':
            logger.info(f"Middleware handling OPTIONS request for {environ.get('PATH_INFO')}")
            resp = WerkzeugResponse()
            resp.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
            resp.headers.add('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            resp.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin')
            resp.headers.add('Access-Control-Allow-Credentials', 'true')
            resp.headers.add('Access-Control-Expose-Headers', 'Content-Type, Authorization')
            resp.headers.add('Access-Control-Max-Age', '3600')
            resp.headers.add('Vary', 'Origin')
            
            return resp(environ, start_response)
        
        return self.app(environ, custom_start_response)

# Add middleware to handle JWT errors specially
class JWTErrorMiddleware:
    """Middleware to handle JWT errors and ensure CORS headers are set"""
    
    def __init__(self, app):
        self.app = app
        
    def __call__(self, environ, start_response):
        try:
            return self.app(environ, start_response)
        except Exception as e:
            logger.error(f"JWTErrorMiddleware caught exception: {str(e)}")
            
            # Check if this is a JWT-related error
            is_jwt_error = False
            error_msg = str(e)
            error_type = 'server_error'
            status_code = 500
            
            # Check for specific JWT error types
            if 'jwt' in error_msg.lower() or isinstance(e, jwt.PyJWTError):
                is_jwt_error = True
                error_type = 'jwt_error'
                status_code = 401
                
                # More specific JWT error types
                if 'expired' in error_msg.lower() or isinstance(e, jwt.ExpiredSignatureError):
                    error_type = 'token_expired'
                    error_msg = 'Token has expired'
                elif 'invalid' in error_msg.lower() or isinstance(e, jwt.InvalidTokenError):
                    error_type = 'invalid_token'
                    error_msg = 'Invalid token'
            
            # Create a Flask-like response with CORS headers
            resp = WerkzeugResponse()
            resp.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
            resp.headers.add('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            resp.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin')
            resp.headers.add('Access-Control-Allow-Credentials', 'true')
            resp.headers.add('Access-Control-Expose-Headers', 'Content-Type, Authorization')
            resp.headers.add('Access-Control-Max-Age', '3600')
            resp.headers.add('Vary', 'Origin')
            
            # Set the response status and body
            resp.status_code = status_code
            resp.content_type = 'application/json'
            
            # Properly format JSON response
            import json
            response_data = {
                'success': False,
                'message': error_msg,
                'error': error_type,
                'data': {}
            }
            resp.set_data(json.dumps(response_data).encode('utf-8'))
            
            return resp(environ, start_response)

def create_cli_app():
    """Create a Flask application for CLI use with correct URL prefixes"""
    app = Flask(__name__)
    
    # Disable automatic redirects for trailing slashes to prevent redirect loops
    app.url_map.strict_slashes = False
    
    # Import configuration
    from config import app_config
    app.config.from_object(app_config['development'])
    
    # Initialize extensions using the shared function
    init_extensions(app)
    
    # Register the JWT-CORS decorator from extensions.py
    app.jwt_cors_optional = jwt_cors_optional_decorator
    logger.info("JWT-CORS decorator registered with application")
    
    # Add a global route to handle OPTIONS requests for all paths
    @app.route('/', defaults={'path': ''}, methods=['OPTIONS'])
    @app.route('/<path:path>', methods=['OPTIONS'])
    def handle_options(path):
        response = make_response()
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin')
        response.headers.add('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        response.headers.add('Access-Control-Expose-Headers', 'Content-Type, Authorization')
        response.headers.add('Access-Control-Max-Age', '3600')
        response.headers.add('Vary', 'Origin')
        logger.info(f"OPTIONS request handled by route handler for path: {path}")
        return response
    
    # Always add CORS headers to all responses
    @app.after_request
    def add_cors_headers(response):
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin')
        response.headers.add('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        response.headers.add('Access-Control-Expose-Headers', 'Content-Type, Authorization')
        response.headers.add('Access-Control-Max-Age', '3600')
        response.headers.add('Vary', 'Origin')
        return response
    
    # Register blueprints with correct URL prefixes
    try:
        # Import all blueprints
        from api.admin import admin_bp
        from api.health import health_bp
        from api.auth import auth_bp
        from api.users import users_bp
        from api.dashboard import dashboard_bp
        from api.analytics import analytics_bp
        from api.campaigns import campaigns_bp
        from api.segments import segments_bp
        from api.customers import customers_bp
        from api.channels import channels_bp
        from api.data import data_bp  # Import the new data blueprint
        
        # Try to import optional blueprints
        try:
            from api.tasks import tasks_bp
            app.register_blueprint(tasks_bp, url_prefix='/api/v1/tasks')
            logger.info("Registered tasks blueprint")
        except ImportError:
            logger.warning("Tasks blueprint not found")
            
        try:
            from api.notifications import notifications_bp
            app.register_blueprint(notifications_bp, url_prefix='/api/v1/notifications')
            logger.info("Registered notifications blueprint")
        except ImportError:
            logger.warning("Notifications blueprint not found")
        
        # IMPORTANT: Register auth blueprint at /api/auth with a unique name
        app.register_blueprint(auth_bp, url_prefix='/api/auth', name='auth_shortpath')
        logger.info("Registered auth blueprint at /api/auth with name 'auth_shortpath'")
        
        # Register all blueprints with non-versioned URL prefixes for frontend compatibility
        app.register_blueprint(analytics_bp, url_prefix='/api/analytics', name='analytics_shortpath')
        logger.info("Registered analytics blueprint at /api/analytics")
        
        app.register_blueprint(campaigns_bp, url_prefix='/api/campaigns', name='campaigns_shortpath')
        logger.info("Registered campaigns blueprint at /api/campaigns")
        
        app.register_blueprint(segments_bp, url_prefix='/api/segments', name='segments_shortpath')
        logger.info("Registered segments blueprint at /api/segments")
        
        app.register_blueprint(customers_bp, url_prefix='/api/customers', name='customers_shortpath')
        logger.info("Registered customers blueprint at /api/customers")
        
        app.register_blueprint(channels_bp, url_prefix='/api/channels', name='channels_shortpath')
        logger.info("Registered channels blueprint at /api/channels")
        
        app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard', name='dashboard_shortpath')
        logger.info("Registered dashboard blueprint at /api/dashboard")
        
        # Register core blueprints with explicit URL prefixes
        app.register_blueprint(admin_bp, url_prefix='/api/v1/admin')
        app.register_blueprint(health_bp, url_prefix='/api/v1/health')
        # Register auth at v1 path with its original name
        app.register_blueprint(auth_bp, url_prefix='/api/v1/auth')
        app.register_blueprint(users_bp, url_prefix='/api/v1/users')
        app.register_blueprint(dashboard_bp, url_prefix='/api/v1/dashboard')
        app.register_blueprint(analytics_bp, url_prefix='/api/v1/analytics')
        app.register_blueprint(campaigns_bp, url_prefix='/api/v1/campaigns')
        app.register_blueprint(segments_bp, url_prefix='/api/v1/segments')
        app.register_blueprint(customers_bp, url_prefix='/api/v1/customers')
        app.register_blueprint(channels_bp, url_prefix='/api/v1/channels')
        app.register_blueprint(data_bp, url_prefix='/api/v1/data')  # Register the new data blueprint
        
        # Log routes
        logger.info("Registered CLI routes:")
        for rule in app.url_map.iter_rules():
            methods = ','.join(rule.methods)
            logger.info(f"  - {rule.endpoint:30s} | {methods:20s} | {rule.rule}")
            
    except Exception as e:
        logger.error(f"Error registering blueprints: {e}")
        raise
        
    # Register API documentation
    try:
        from utils.apispec import register_apispec
        register_apispec(app)
        logger.info("API documentation registered successfully")
    except Exception as e:
        logger.error(f"Error registering API documentation: {str(e)}")
    
    # Wrap the app with the CORS middleware
    app.wsgi_app = CORSMiddleware(app.wsgi_app)
    logger.info("CORS middleware applied to application")
    
    # Wrap the CORS middleware with the JWT error middleware
    app.wsgi_app = JWTErrorMiddleware(app.wsgi_app)
    logger.info("JWT error middleware applied to application")
        
    return app

# Create the app
try:
    app = create_cli_app()
    logger.info("CLI app created successfully")
except Exception as e:
    logger.error(f"Failed to create CLI app: {e}")
    # For Flask CLI, we need to provide an app even if it fails
    app = Flask(__name__)
    
    @app.route('/')
    def error_index():
        return "Application failed to initialize. Check logs for details."

if __name__ == '__main__':
    app.run(debug=True, port=5000) 
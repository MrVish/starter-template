"""
Special entry point for Flask CLI that ensures the blueprints
are registered with the correct URL prefixes.
"""
import os
import sys
import logging
from flask import Flask
from flask_cors import CORS

# Set up CLI-specific logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Import extensions
from extensions import init_extensions

def create_cli_app():
    """Create a Flask application for CLI use with correct URL prefixes"""
    app = Flask(__name__)
    
    # Import configuration
    from config import app_config
    app.config.from_object(app_config['development'])
    
    # Enhanced CORS setup
    CORS(app, 
         resources={r"/api/*": {
             "origins": ["http://localhost:3000"], 
             "supports_credentials": True,
             "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
             "allow_headers": ["Content-Type", "Authorization", "X-Requested-With", "Accept"]
         }})
    
    # Initialize extensions using the shared function
    init_extensions(app)
    
    # Add a before_request handler to properly handle OPTIONS requests
    @app.before_request
    def handle_options_requests():
        from flask import request, make_response
        if request.method == 'OPTIONS':
            response = make_response()
            response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
            response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With,Accept')
            response.headers.add('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
            response.headers.add('Access-Control-Allow-Credentials', 'true')
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
        
        # Register core blueprints with explicit URL prefixes
        app.register_blueprint(admin_bp, url_prefix='/api/v1/admin')
        app.register_blueprint(health_bp, url_prefix='/api/v1/health')
        app.register_blueprint(auth_bp, url_prefix='/api/v1/auth')
        app.register_blueprint(users_bp, url_prefix='/api/v1/users')
        app.register_blueprint(dashboard_bp, url_prefix='/api/v1/dashboard')
        app.register_blueprint(analytics_bp, url_prefix='/api/v1/analytics')
        app.register_blueprint(campaigns_bp, url_prefix='/api/v1/campaigns')
        app.register_blueprint(segments_bp, url_prefix='/api/v1/segments')
        app.register_blueprint(customers_bp, url_prefix='/api/v1/customers')
        app.register_blueprint(channels_bp, url_prefix='/api/v1/channels')
        
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
    app.run(debug=True) 
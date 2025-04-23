import os
from flask import Flask
from flask_cors import CORS
from extensions import db, migrate, jwt, ma
from config import app_config
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Display a prominent warning message
logger.warning("""
*******************************************************************************
* WARNING: This app.py is not the recommended entry point for the application.
* Please use the following command to run the server with proper API routing:
*
* flask --app cli_app run --debug
*
* Using 'flask run' directly with this app.py may result in incorrect routing.
*******************************************************************************
""")

def create_app(config_name=None):
    """Application Factory Pattern"""
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'development')
    
    app = Flask(__name__)
    app.config.from_object(app_config[config_name])
    
    # Initialize extensions
    initialize_extensions(app)
    
    # Register blueprints
    register_blueprints(app)
    
    # Register error handlers
    register_error_handlers(app)
    
    return app

def initialize_extensions(app):
    """Initialize Flask extensions"""
    # Initialize CORS
    try:
        CORS(app, supports_credentials=True, origins=["http://localhost:3000"])
        logger.info("CORS initialized successfully")
    except Exception as e:
        logger.error(f"Error initializing CORS: {str(e)}")
    
    # Initialize SQLAlchemy
    db.init_app(app)
    
    # Initialize Flask-Migrate
    migrate.init_app(app, db)
    
    # Initialize Flask-JWT-Extended
    jwt.init_app(app)
    
    # Initialize Flask-Marshmallow
    ma.init_app(app)

def register_blueprints(app):
    """Register Flask blueprints"""
    try:
        # Define API prefix for all routes
        api_prefix = '/api/v1'
        
        # Import all blueprints
        from api.admin import admin_bp
        from api.health import health_bp
        from api.auth import auth_bp
        from api.users import users_bp
        
        # Try to import optional blueprints
        try:
            from api.tasks import tasks_bp
            app.register_blueprint(tasks_bp, url_prefix=f'{api_prefix}/tasks')
            logger.debug(f"Registered tasks blueprint with prefix: {api_prefix}/tasks")
        except ImportError:
            logger.warning("Tasks blueprint not found")
            
        try:
            from api.campaigns import campaigns_bp
            app.register_blueprint(campaigns_bp, url_prefix=f'{api_prefix}/campaigns')
            logger.debug(f"Registered campaigns blueprint with prefix: {api_prefix}/campaigns")
        except ImportError:
            logger.warning("Campaigns blueprint not found")
            
        try:
            from api.notifications import notifications_bp
            app.register_blueprint(notifications_bp, url_prefix=f'{api_prefix}/notifications')
            logger.debug(f"Registered notifications blueprint with prefix: {api_prefix}/notifications")
        except ImportError:
            logger.warning("Notifications blueprint not found")
        
        # Register core blueprints with explicit URL prefixes
        app.register_blueprint(admin_bp, url_prefix=f'{api_prefix}/admin')
        app.register_blueprint(health_bp, url_prefix=f'{api_prefix}/health')
        app.register_blueprint(auth_bp, url_prefix=f'{api_prefix}/auth')
        app.register_blueprint(users_bp, url_prefix=f'{api_prefix}/users')
        
        # Log each registered blueprint and its URL prefix
        logger.info("Registered blueprints:")
        for name, blueprint in app.blueprints.items():
            logger.info(f"  - {name}: {blueprint.url_prefix}")
        
        # Explicitly print all routes and their URLs
        logger.info("All registered routes:")
        rules_by_prefix = {}
        for rule in app.url_map.iter_rules():
            prefix = rule.rule.split('/')[1] if len(rule.rule.split('/')) > 1 else 'root'
            if prefix not in rules_by_prefix:
                rules_by_prefix[prefix] = []
            rules_by_prefix[prefix].append((rule.endpoint, rule.rule, ','.join(rule.methods)))
        
        # Print all routes organized by prefix
        for prefix, rules in rules_by_prefix.items():
            logger.info(f"Routes with prefix '/{prefix}':")
            for endpoint, rule, methods in rules:
                logger.info(f"  - {endpoint:30s} | {methods:20s} | {rule}")
        
        logger.info("All blueprints registered successfully")
    except Exception as e:
        logger.error(f"Error registering blueprints: {str(e)}")
        # Re-raise to prevent app from starting with incomplete routes
        raise

def register_error_handlers(app):
    """Register error handlers"""
    try:
        # Import error handlers
        from utils.errors import register_error_handlers as register_app_error_handlers
        register_app_error_handlers(app)
        logger.info("Error handlers registered successfully")
    except Exception as e:
        logger.error(f"Error registering error handlers: {str(e)}")

# Initialize API documentation
def register_apispec(app):
    """Register API documentation"""
    try:
        from utils.apispec import register_apispec as register_app_apispec
        register_app_apispec(app)
        logger.info("API documentation registered successfully")
    except Exception as e:
        logger.error(f"Error registering API documentation: {str(e)}")

# Create the app instance
app = create_app()

# Register API documentation
register_apispec(app)

# Make sure Flask CLI uses this app
if __name__ == 'app' or __name__ == '__main__':
    # This ensures the app is correctly detected by Flask CLI
    # No need to re-register blueprints - they're already registered above
    mode = "Flask CLI mode" if __name__ == 'app' else "Direct script mode"
    logger.info(f"Starting application in {mode}")
    logger.info(f"__name__ is '{__name__}'")
    
    # Log routes to verify they exist with correct prefixes
    logger.info(f"Available routes for {mode}:")
    for rule in app.url_map.iter_rules():
        if 'admin' in rule.endpoint or 'health' in rule.endpoint:
            logger.info(f"  - {rule.endpoint} -> {rule.rule}")

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True) 
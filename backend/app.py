import os
from flask import Flask
from flask_cors import CORS
from extensions import db, migrate, jwt, ma, init_extensions
from config import app_config
import logging
import sys

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
    
    # Enhanced CORS setup
    CORS(app, 
         resources={r"/api/*": {
             "origins": ["http://localhost:3000"], 
             "supports_credentials": True,
             "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
             "allow_headers": ["Content-Type", "Authorization", "X-Requested-With", "Accept"]
         }})
    
    # Initialize extensions - using the improved function from extensions.py
    init_extensions(app)
    
    # Register blueprints
    register_blueprints(app)
    
    # Register error handlers
    register_error_handlers(app)
    
    # Register API documentation
    try:
        from utils.apispec import register_apispec
        register_apispec(app)
        logger.info("API documentation registered successfully")
    except Exception as e:
        logger.error(f"Error registering API documentation: {str(e)}")
    
    return app

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
        from api.dashboard import dashboard_bp
        from api.analytics import analytics_bp
        from api.campaigns import campaigns_bp
        from api.segments import segments_bp
        from api.customers import customers_bp
        from api.channels import channels_bp
        
        # Try to import optional blueprints
        try:
            from api.tasks import tasks_bp
            app.register_blueprint(tasks_bp, url_prefix=f'{api_prefix}/tasks')
            logger.debug(f"Registered tasks blueprint with prefix: {api_prefix}/tasks")
        except ImportError:
            logger.warning("Tasks blueprint not found")
            
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
        app.register_blueprint(dashboard_bp, url_prefix=f'{api_prefix}/dashboard')
        app.register_blueprint(analytics_bp, url_prefix=f'{api_prefix}/analytics')
        app.register_blueprint(campaigns_bp, url_prefix=f'{api_prefix}/campaigns')
        app.register_blueprint(segments_bp, url_prefix=f'{api_prefix}/segments')
        app.register_blueprint(customers_bp, url_prefix=f'{api_prefix}/customers')
        app.register_blueprint(channels_bp, url_prefix=f'{api_prefix}/channels')
        
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

def show_direct_execution_warning():
    """Show a warning if the app.py file is executed directly"""
    logger.warning("""
*******************************************************************************
* WARNING: Running app.py directly is not the recommended approach.           *
* Please use the following command instead:                                  *
*                                                                             *
* flask --app cli_app run --debug                                            *
*                                                                             *
* This will ensure proper API routing and configuration.                     *
*******************************************************************************
""")

# Only create the app if this is the main module or intended to be used by Flask CLI
if __name__ == '__main__' or __name__ == 'app':
    try:
        app = create_app()
        logger.info(f"Application created successfully in {__name__} mode")
        
        # Log routes if needed
        if __name__ == 'app':  # Flask CLI mode
            logger.info("Available routes for Flask CLI mode:")
            for rule in app.url_map.iter_rules():
                if 'admin' in rule.endpoint or 'health' in rule.endpoint:
                    logger.info(f"  - {rule.endpoint} -> {rule.rule}")
    except Exception as e:
        logger.error(f"Error creating application: {str(e)}")
        # For Flask CLI, we need to provide an app
        if __name__ == 'app':
            logger.error("Creating minimal app for Flask CLI to avoid complete failure")
            app = Flask(__name__)
        else:
            # For direct execution, we can just exit
            logger.error("Application failed to start, exiting")
            sys.exit(1)

# Handle direct execution
if __name__ == '__main__':
    # Show warning about direct execution
    show_direct_execution_warning()
    
    # Run the app
    try:
        port = int(os.getenv('PORT', 5000))
        app.run(host='0.0.0.0', port=port, debug=True)
    except Exception as e:
        logger.error(f"Error running application: {str(e)}") 
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
from extensions import db, jwt, migrate, ma

def create_cli_app():
    """Create a Flask application for CLI use with correct URL prefixes"""
    app = Flask(__name__)
    
    # Import configuration
    from config import app_config
    app.config.from_object(app_config['development'])
    
    # Initialize extensions
    CORS(app, supports_credentials=True, origins=["http://localhost:3000"])
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    ma.init_app(app)
    
    # Register blueprints with correct URL prefixes
    try:
        # Import all blueprints
        from api.admin import admin_bp
        from api.health import health_bp
        from api.auth import auth_bp
        from api.users import users_bp
        
        # Try to import optional blueprints
        try:
            from api.tasks import tasks_bp
            app.register_blueprint(tasks_bp, url_prefix='/api/v1/tasks')
        except ImportError:
            logger.warning("Tasks blueprint not found")
            
        try:
            from api.campaigns import campaigns_bp
            app.register_blueprint(campaigns_bp, url_prefix='/api/v1/campaigns')
            logger.warning("DEPRECATED: Marketing campaigns blueprint is registered but marked for removal")
        except ImportError:
            logger.warning("Campaigns blueprint not found")
            
        try:
            from api.notifications import notifications_bp
            app.register_blueprint(notifications_bp, url_prefix='/api/v1/notifications')
        except ImportError:
            logger.warning("Notifications blueprint not found")
            
        try:
            from api.ml import ml_bp
            app.register_blueprint(ml_bp, url_prefix='/api/v1/models')
            logger.warning("DEPRECATED: ML model blueprint is registered but marked for removal")
        except ImportError:
            logger.warning("ML model blueprint not found")
        
        # Register core blueprints with explicit URL prefixes
        app.register_blueprint(admin_bp, url_prefix='/api/v1/admin')
        app.register_blueprint(health_bp, url_prefix='/api/v1/health')
        app.register_blueprint(auth_bp, url_prefix='/api/v1/auth')
        app.register_blueprint(users_bp, url_prefix='/api/v1/users')
        
        # Log routes
        logger.info("Registered CLI routes:")
        for rule in app.url_map.iter_rules():
            methods = ','.join(rule.methods)
            logger.info(f"  - {rule.endpoint:30s} | {methods:20s} | {rule.rule}")
            
    except Exception as e:
        logger.error(f"Error registering blueprints: {e}")
        
    return app

# Create the app
app = create_cli_app()

if __name__ == '__main__':
    app.run(debug=True) 
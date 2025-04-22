import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from extensions import db, jwt, migrate

# Load environment variables from .env file
load_dotenv()

def create_app(config=None):
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object('config.Config')
    
    # Override config if provided
    if config:
        app.config.update(config)
    
    # Initialize extensions with app
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    
    # Enable CORS
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    # Initialize API documentation
    from utils.swagger import init_swagger
    init_swagger(app)
    
    # Initialize error handling
    from utils.error_handler import init_app as init_error_handling
    init_error_handling(app)
    
    # Initialize Celery
    from tasks import make_celery
    celery = make_celery(app)
    app.extensions['celery'] = celery
    
    # Register blueprints
    with app.app_context():
        # Import blueprints here to avoid circular imports
        from api.auth import auth_bp
        from api.users import users_bp
        from api.dashboard import dashboard_bp
        from api.health import health_bp
        # Comment out ML blueprint to avoid dependency issues
        # from api.ml import ml_bp
        
        # Add versioning to API routes
        api_version = os.environ.get('API_VERSION', 'v1')
        
        app.register_blueprint(auth_bp, url_prefix=f'/api/{api_version}/auth')
        app.register_blueprint(users_bp, url_prefix=f'/api/{api_version}/users')
        app.register_blueprint(dashboard_bp, url_prefix=f'/api/{api_version}/dashboard')
        app.register_blueprint(health_bp, url_prefix=f'/api/{api_version}/health')
        # Comment out ML blueprint registration
        # app.register_blueprint(ml_bp, url_prefix=f'/api/{api_version}/ml')
    
        # Create DB tables if they don't exist
        db.create_all()
        
        # Wait for a moment to ensure tables are created
        import time
        time.sleep(2)
        
        # Initialize roles and permissions if needed
        try:
            from utils.init_db import init_roles_and_permissions
            init_roles_and_permissions()
        except Exception as e:
            app.logger.warning(f"Error initializing roles/permissions: {str(e)}")
            # Don't raise the error, allow the app to continue
            pass
    
    # Shell context
    @app.shell_context_processor
    def make_shell_context():
        return {
            'db': db,
            'app': app,
            'celery': celery
        }
    
    return app

app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get("PORT", 5000)), debug=True) 
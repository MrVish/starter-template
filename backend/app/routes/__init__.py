from flask import Blueprint
from app.routes.auth import auth_bp

def register_routes(app):
    """Register all blueprints/routes with the app"""
    # Import and register blueprints here
    app.register_blueprint(auth_bp, url_prefix='/auth')
    pass 
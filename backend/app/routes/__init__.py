from flask import Blueprint
from app.routes.auth import auth_bp
from app.routes.admin import admin_bp

def register_routes(app):
    """Register all blueprints/routes with the app"""
    # Import and register blueprints here
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(admin_bp, url_prefix='/admin')
    pass 
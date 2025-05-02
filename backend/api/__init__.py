"""API blueprint package"""

from flask import Blueprint
from .auth import auth_bp
from .admin import admin_bp
from .users import users_bp
from .health import health_bp
from .dashboard import dashboard_bp
from .analytics import analytics_bp
from .campaigns import campaigns_bp
from .segments import segments_bp
from .customers import customers_bp
from .channels import channels_bp
from .data import data_bp
import logging

logger = logging.getLogger(__name__)

# Create main API Blueprint
api = Blueprint('api', __name__, url_prefix='/api')

def register_blueprints(app):
    """Register all API blueprints with the Flask app"""
    try:
        # Register dashboard API (fix the URL path prefix)
        app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
        logger.info("Registered dashboard blueprint at /api/dashboard")
        
        # Register auth API
        app.register_blueprint(auth_bp, url_prefix='/api/auth')
        logger.info("Registered auth blueprint at /api/auth")
        
        # Register other blueprints here as needed
        
        return True
    except Exception as e:
        logger.error(f"Failed to register blueprints: {e}")
        return False

# Register all API blueprints
api.register_blueprint(auth_bp, url_prefix='/auth')
api.register_blueprint(admin_bp, url_prefix='/admin')
api.register_blueprint(users_bp, url_prefix='/users')
api.register_blueprint(health_bp, url_prefix='/health')
api.register_blueprint(dashboard_bp, url_prefix='/dashboard')
api.register_blueprint(analytics_bp, url_prefix='/analytics')
api.register_blueprint(campaigns_bp, url_prefix='/campaigns')
api.register_blueprint(segments_bp, url_prefix='/segments')
api.register_blueprint(customers_bp, url_prefix='/customers')
api.register_blueprint(channels_bp, url_prefix='/channels')
api.register_blueprint(data_bp, url_prefix='/data')

# This file intentionally left empty to mark the directory as a Python package 
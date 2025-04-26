"""API blueprint package"""

from .auth import auth_bp
from .admin import admin_bp
from .users import users_bp
from .health import health_bp
from .dashboard import dashboard_bp
from .analytics import analytics_bp
from .campaigns import campaigns_bp
from .segments import segments_bp
from .customers import customers_bp

# This file intentionally left empty to mark the directory as a Python package 
import os
import psutil
import platform
from datetime import datetime
from flask import Blueprint, jsonify, current_app
from extensions import db
from utils.decorators import audit_log

health_bp = Blueprint('health', __name__)

@health_bp.route('/', methods=['GET'])
@audit_log(action_type='health_check')
def health_check():
    """
    Health Check Endpoint
    ---
    tags:
      - System
    responses:
      200:
        description: System is healthy
      500:
        description: System has issues
    """
    # Check if database connection is working
    db_status = "healthy"
    try:
        db.session.execute("SELECT 1")
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"
    
    # System information
    system_info = {
        "os": platform.system(),
        "python_version": platform.python_version(),
        "cpu_usage": psutil.cpu_percent(),
        "memory_usage": psutil.virtual_memory().percent,
        "disk_usage": psutil.disk_usage('/').percent
    }
    
    # Service status
    status = {
        "status": "healthy" if db_status == "healthy" else "degraded",
        "database": db_status,
        "timestamp": datetime.utcnow().isoformat(),
        "system": system_info
    }
    
    return jsonify(status)

@health_bp.route('/version', methods=['GET'])
def get_version():
    """
    Get API Version
    ---
    tags:
      - System
    responses:
      200:
        description: API version information
    """
    # Read version from environment or config
    version = current_app.config.get('API_VERSION', '1.0.0')
    build_date = current_app.config.get('BUILD_DATE', datetime.utcnow().isoformat())
    
    return jsonify({
        "version": version,
        "build_date": build_date,
        "environment": current_app.config.get('FLASK_ENV', 'production'),
    }) 
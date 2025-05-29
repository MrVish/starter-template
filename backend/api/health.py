import os
import psutil
import platform
from datetime import datetime
from flask import Blueprint, jsonify, current_app, request
from extensions import db
from utils.decorators import audit_log
from flask_cors import cross_origin
import jwt
from sqlalchemy import text
# Create the blueprint without a url_prefix - this will be set in app.py
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
        db.session.execute(text("SELECT 1"))
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

@health_bp.route('/check', methods=['GET'])
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True)
def simple_health_check():
    """Simple health check endpoint"""
    return jsonify({
        'status': 'ok',
        'message': 'Service is running'
    })

@health_bp.route('/debug-token', methods=['GET', 'OPTIONS'])
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True, allow_headers=["Authorization", "Content-Type"])
def debug_token():
    """Debug endpoint for token analysis without authentication"""
    if request.method == 'OPTIONS':
        return '', 200
        
    try:
        # Get and print auth header
        auth_header = request.headers.get('Authorization')
        print(f"Health debug token - Authorization header: {auth_header}")
        
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({
                'error': 'Missing or invalid Authorization header',
                'header_received': auth_header
            }), 400
            
        # Extract token
        token = auth_header.split(' ')[1]
        
        # Try to decode with PyJWT (raw decoding without verification)
        raw_decode_error = None
        raw_token_data = None
        try:
            # First try without verification
            raw_token_data = jwt.decode(token, options={"verify_signature": False})
        except Exception as e:
            raw_decode_error = str(e)
        
        # Return all debug information
        return jsonify({
            'token': token,
            'token_type': auth_header.split(' ')[0] if auth_header else None,
            'raw_decoded_data': raw_token_data,
            'raw_decode_error': raw_decode_error,
            'header_structure': 'Valid Bearer format' if auth_header and auth_header.startswith('Bearer ') else 'Invalid format'
        })
    except Exception as e:
        print(f"Error in health debug-token: {str(e)}")
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500 
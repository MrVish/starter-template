import time
import json
import functools
import logging
from datetime import datetime
from flask import request, g, jsonify, current_app
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from models.dim_users import DimUser

# Configure audit logger
audit_logger = logging.getLogger('audit')
file_handler = logging.FileHandler('audit.log')
file_handler.setFormatter(logging.Formatter(
    '%(asctime)s [%(levelname)s] %(message)s',
    '%Y-%m-%d %H:%M:%S'
))
audit_logger.addHandler(file_handler)
audit_logger.setLevel(logging.INFO)

def audit_log(action_type=None):
    """
    Decorator to log API actions for auditing purposes
    
    Args:
        action_type: Type of action (e.g., 'read', 'create', 'update', 'delete')
    """
    def decorator(f):
        @functools.wraps(f)
        def wrapped(*args, **kwargs):
            start_time = time.time()
            
            # Get user info if available
            user_id = None
            try:
                verify_jwt_in_request(optional=True)
                user_id = get_jwt_identity()
            except:
                pass
            
            # Capture request info
            request_data = {
                'method': request.method,
                'endpoint': request.path,
                'params': dict(request.args),
                'ip': request.remote_addr,
                'user_agent': request.user_agent.string
            }
            
            # Safely capture request body if it's JSON
            try:
                if request.is_json:
                    # Don't log sensitive data
                    body = request.get_json()
                    if isinstance(body, dict):
                        # Mask sensitive fields
                        for field in ['password', 'token', 'secret', 'key']:
                            if field in body:
                                body[field] = '***REDACTED***'
                        request_data['body'] = body
            except:
                pass
            
            # Execute the function
            try:
                response = f(*args, **kwargs)
                status_code = response[1] if isinstance(response, tuple) else 200
                duration = round((time.time() - start_time) * 1000, 2)  # ms
                
                # Log the action
                log_data = {
                    'action': action_type or f.__name__,
                    'user_id': user_id,
                    'timestamp': datetime.utcnow().isoformat(),
                    'request': request_data,
                    'status_code': status_code,
                    'duration_ms': duration
                }
                
                audit_logger.info(json.dumps(log_data))
                return response
                
            except Exception as e:
                # Log the error
                duration = round((time.time() - start_time) * 1000, 2)
                log_data = {
                    'action': action_type or f.__name__,
                    'user_id': user_id,
                    'timestamp': datetime.utcnow().isoformat(),
                    'request': request_data,
                    'error': str(e),
                    'duration_ms': duration
                }
                audit_logger.error(json.dumps(log_data))
                raise
                
        return wrapped
    return decorator

def role_required(role_name):
    """
    Decorator to check if the current user has the required role
    
    Args:
        role_name: Name of the required role
    """
    def decorator(f):
        @functools.wraps(f)
        def wrapped(*args, **kwargs):
            verify_jwt_in_request()
            user_id = get_jwt_identity()
            user = DimUser.query.get(user_id)
            
            if not user:
                return jsonify({'error': 'User not found'}), 404
                
            if not user.has_role(role_name):
                return jsonify({'error': f'Role {role_name} required'}), 403
                
            return f(*args, **kwargs)
        return wrapped
    return decorator

def permission_required(action, resource):
    """
    Decorator to check if the current user has the required permission
    
    Args:
        action: Action type (e.g., 'read', 'write', 'delete')
        resource: Resource type (e.g., 'model', 'report')
    """
    def decorator(f):
        @functools.wraps(f)
        def wrapped(*args, **kwargs):
            verify_jwt_in_request()
            user_id = get_jwt_identity()
            user = DimUser.query.get(user_id)
            
            if not user:
                return jsonify({'error': 'User not found'}), 404
                
            if not user.can(action, resource) and not user.is_admin:
                return jsonify({'error': f'Permission denied: {action} {resource}'}), 403
                
            return f(*args, **kwargs)
        return wrapped
    return decorator 
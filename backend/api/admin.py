from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, decode_token
from models.user import User, Role, Permission
from extensions import db
from flask_cors import cross_origin
import jwt
from functools import wraps

# Create the blueprint without a url_prefix - this will be set in app.py
admin_bp = Blueprint('admin', __name__)

def is_admin_user(user):
    return any(r.name.lower() in ['administrator', 'admin', 'Administrator'] for r in user.roles)

# Custom auth decorator that handles NextAuth tokens
def custom_jwt_required(optional=False):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            # Skip auth for OPTIONS requests
            if request.method == 'OPTIONS':
                return fn(*args, **kwargs)
                
            auth_header = request.headers.get('Authorization')
            if not auth_header or not auth_header.startswith('Bearer '):
                if optional:
                    return fn(*args, **kwargs)
                return jsonify({'error': 'Authorization header is required'}), 401
            
            token = auth_header.split(' ')[1]
            
            try:
                # First try standard Flask-JWT-Extended
                from flask import current_app
                user_id = get_jwt_identity()
                print(f"JWT identity found: {user_id}")
            except Exception as e:
                print(f"Standard JWT failed: {str(e)}")
                try:
                    # Try to decode with PyJWT as fallback (for NextAuth tokens)
                    secret_key = current_app.config['JWT_SECRET_KEY']
                    # Try without verification first to get the user ID
                    payload = jwt.decode(token, options={"verify_signature": False})
                    user_id = payload.get('sub')
                    print(f"NextAuth token payload: {payload}")
                    
                    if not user_id:
                        return jsonify({'error': 'Invalid token format'}), 401
                except Exception as jwt_error:
                    print(f"JWT decode error: {str(jwt_error)}")
                    if optional:
                        return fn(*args, **kwargs)
                    return jsonify({'error': 'Invalid token'}), 401
            
            # At this point we have a user_id from either method
            try:
                # Check if user exists and has proper permissions
                if user_id:
                    user = User.query.get(user_id)
                    if not user:
                        if optional:
                            return fn(*args, **kwargs)
                        return jsonify({'error': 'User not found'}), 404
                        
                    # Store user in Flask g object for access in route function
                    from flask import g
                    g.current_user = user
                    return fn(*args, **kwargs)
                else:
                    if optional:
                        return fn(*args, **kwargs)
                    return jsonify({'error': 'Invalid user ID in token'}), 401
            except Exception as e:
                print(f"User lookup error: {str(e)}")
                if optional:
                    return fn(*args, **kwargs)
                return jsonify({'error': 'Authentication error'}), 401
                
        return wrapper
    return decorator

# Helper to get current user from g object
def get_current_user():
    from flask import g
    return getattr(g, 'current_user', None)

# ----- User endpoints -----
@admin_bp.route('/users', methods=['GET', 'OPTIONS'])
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True, allow_headers=["Authorization", "Content-Type"])
@custom_jwt_required(optional=False)
def list_users():
    if request.method == 'OPTIONS':
        return '', 200
        
    try:
        # Get current user from our decorator
        current_user = get_current_user()
        
        # Check admin permissions
        if not current_user or not is_admin_user(current_user):
            return jsonify({'error': 'Unauthorized - Admin access required'}), 403
            
        # Get all users
        users = User.query.all()
        user_list = []
        
        # Convert to JSON
        for user in users:
            try:
                user_dict = user.to_dict() 
                user_list.append(user_dict)
            except Exception as e:
                print(f"Error converting user to dict: {str(e)}")
                user_list.append({
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'error': 'Could not serialize complete user data'
                })
                
        return jsonify(user_list)
    except Exception as e:
        print(f"Error in list_users: {str(e)}")
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

@admin_bp.route('/users', methods=['POST', 'OPTIONS'])
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True, allow_headers=["Authorization", "Content-Type"])
@custom_jwt_required(optional=False)
def create_user():
    if request.method == 'OPTIONS':
        return '', 200
        
    try:
        # Get current user from our decorator
        current_user = get_current_user()
        
        # Check admin permissions
        if not current_user or not is_admin_user(current_user):
            return jsonify({'error': 'Unauthorized - Admin access required'}), 403
            
        # Get request data
        data = request.get_json()
        
        # Validate required fields
        if not data.get('username') or not data.get('email'):
            return jsonify({'error': 'Username and email are required'}), 400
            
        # Check if username or email already exists
        if User.query.filter_by(username=data.get('username')).first():
            return jsonify({'error': 'Username already taken'}), 400
            
        if User.query.filter_by(email=data.get('email')).first():
            return jsonify({'error': 'Email already registered'}), 400
            
        # Create user
        user = User(
            username=data.get('username'), 
            email=data.get('email'),
            first_name=data.get('first_name', ''),
            last_name=data.get('last_name', '')
        )
        
        # Set password if provided
        if data.get('password'):
            from werkzeug.security import generate_password_hash
            user.password_hash = generate_password_hash(data['password'])
            
        # Add roles if provided
        if 'roles' in data and data['roles']:
            for role_name in data['roles']:
                role = Role.query.filter_by(name=role_name).first()
                if role:
                    user.roles.append(role)
                else:
                    # Create the role if it doesn't exist
                    new_role = Role(name=role_name, description=f"Auto-created role: {role_name}")
                    db.session.add(new_role)
                    db.session.flush()  # Assign ID without committing
                    user.roles.append(new_role)
                    
        db.session.add(user)
        db.session.commit()
        
        return jsonify(user.to_dict()), 201
    except Exception as e:
        print(f"Error in create_user: {str(e)}")
        db.session.rollback()
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

@admin_bp.route('/users/<int:user_id>', methods=['PUT', 'OPTIONS'])
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True, allow_headers=["Authorization", "Content-Type"])
def update_user(user_id):
    if request.method == 'OPTIONS':
        return '', 200
        
    # JWT validation for non-OPTIONS
    current_user_id = get_jwt_identity()
    if not current_user_id:
        return jsonify({'error': 'Authentication required'}), 401
    
    data = request.get_json()
    user = User.query.get_or_404(user_id)
    user.username = data.get('username', user.username)
    user.email = data.get('email', user.email)
    if data.get('password'):
        user.set_password(data['password'])
    if 'roles' in data:
        user.roles = []
        for role_name in data['roles']:
            role = Role.query.filter_by(name=role_name).first()
            if role:
                user.roles.append(role)
    db.session.commit()
    return jsonify(user.to_dict())

@admin_bp.route('/users/<int:user_id>', methods=['DELETE', 'OPTIONS'])
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True, allow_headers=["Authorization", "Content-Type"])
def delete_user(user_id):
    if request.method == 'OPTIONS':
        return '', 200
        
    # JWT validation for non-OPTIONS
    current_user_id = get_jwt_identity()
    if not current_user_id:
        return jsonify({'error': 'Authentication required'}), 401
        
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return '', 204

# ----- Role endpoints -----
@admin_bp.route('/roles', methods=['GET', 'OPTIONS'])
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True, allow_headers=["Authorization", "Content-Type"])
@custom_jwt_required(optional=False)
def list_roles():
    if request.method == 'OPTIONS':
        return '', 200
        
    try:
        # Get current user from our decorator
        current_user = get_current_user()
        
        # Check admin permissions
        if not current_user or not is_admin_user(current_user):
            return jsonify({'error': 'Unauthorized - Admin access required'}), 403
            
        # Get all roles
        roles = Role.query.all()
        role_list = []
        
        # Convert to JSON
        for role in roles:
            try:
                role_dict = role.to_dict() 
                role_list.append(role_dict)
            except Exception as e:
                print(f"Error converting role to dict: {str(e)}")
                role_list.append({
                    'id': role.id,
                    'name': role.name,
                    'error': 'Could not serialize complete role data'
                })
                
        return jsonify(role_list)
    except Exception as e:
        print(f"Error in list_roles: {str(e)}")
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

@admin_bp.route('/roles', methods=['POST', 'OPTIONS'])
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True, allow_headers=["Authorization", "Content-Type"])
def create_role():
    if request.method == 'OPTIONS':
        return '', 200
        
    # JWT validation for non-OPTIONS
    current_user_id = get_jwt_identity()
    if not current_user_id:
        return jsonify({'error': 'Authentication required'}), 401
        
    data = request.get_json()
    role = Role(name=data.get('name'), description=data.get('description'))
    db.session.add(role)
    db.session.commit()
    return jsonify(role.to_dict()), 201

@admin_bp.route('/roles/<int:role_id>', methods=['PUT', 'OPTIONS'])
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True, allow_headers=["Authorization", "Content-Type"])
def update_role(role_id):
    if request.method == 'OPTIONS':
        return '', 200
        
    # JWT validation for non-OPTIONS
    current_user_id = get_jwt_identity()
    if not current_user_id:
        return jsonify({'error': 'Authentication required'}), 401
        
    data = request.get_json()
    role = Role.query.get_or_404(role_id)
    role.name = data.get('name', role.name)
    role.description = data.get('description', role.description)
    db.session.commit()
    return jsonify(role.to_dict())

@admin_bp.route('/roles/<int:role_id>', methods=['DELETE', 'OPTIONS'])
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True, allow_headers=["Authorization", "Content-Type"])
def delete_role(role_id):
    if request.method == 'OPTIONS':
        return '', 200
        
    # JWT validation for non-OPTIONS
    current_user_id = get_jwt_identity()
    if not current_user_id:
        return jsonify({'error': 'Authentication required'}), 401
        
    role = Role.query.get_or_404(role_id)
    db.session.delete(role)
    db.session.commit()
    return '', 204

# ----- Permission endpoints -----
@admin_bp.route('/permissions', methods=['GET', 'OPTIONS'])
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True, allow_headers=["Authorization", "Content-Type"])
@custom_jwt_required(optional=False)
def list_permissions():
    if request.method == 'OPTIONS':
        return '', 200
        
    try:
        # Get current user from our decorator
        current_user = get_current_user()
        
        # Check admin permissions
        if not current_user or not is_admin_user(current_user):
            return jsonify({'error': 'Unauthorized - Admin access required'}), 403
            
        # Get all permissions
        permissions = Permission.query.all()
        perm_list = []
        
        # Convert to JSON
        for perm in permissions:
            try:
                perm_dict = perm.to_dict() 
                perm_list.append(perm_dict)
            except Exception as e:
                print(f"Error converting permission to dict: {str(e)}")
                perm_list.append({
                    'id': perm.id,
                    'name': perm.name,
                    'error': 'Could not serialize complete permission data'
                })
                
        return jsonify(perm_list)
    except Exception as e:
        print(f"Error in list_permissions: {str(e)}")
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

@admin_bp.route('/permissions', methods=['POST', 'OPTIONS'])
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True, allow_headers=["Authorization", "Content-Type"])
def create_permission():
    if request.method == 'OPTIONS':
        return '', 200
        
    # JWT validation for non-OPTIONS
    current_user_id = get_jwt_identity()
    if not current_user_id:
        return jsonify({'error': 'Authentication required'}), 401
        
    data = request.get_json()
    perm = Permission(
        name=data.get('name'),
        description=data.get('description'),
        resource=data.get('resource'),
        action=data.get('action')
    )
    db.session.add(perm)
    db.session.commit()
    return jsonify(perm.to_dict()), 201

@admin_bp.route('/permissions/<int:perm_id>', methods=['PUT', 'OPTIONS'])
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True, allow_headers=["Authorization", "Content-Type"])
def update_permission(perm_id):
    if request.method == 'OPTIONS':
        return '', 200
        
    # JWT validation for non-OPTIONS
    current_user_id = get_jwt_identity()
    if not current_user_id:
        return jsonify({'error': 'Authentication required'}), 401
        
    data = request.get_json()
    perm = Permission.query.get_or_404(perm_id)
    perm.name = data.get('name', perm.name)
    perm.description = data.get('description', perm.description)
    perm.resource = data.get('resource', perm.resource)
    perm.action = data.get('action', perm.action)
    db.session.commit()
    return jsonify(perm.to_dict())

@admin_bp.route('/permissions/<int:perm_id>', methods=['DELETE', 'OPTIONS'])
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True, allow_headers=["Authorization", "Content-Type"])
def delete_permission(perm_id):
    if request.method == 'OPTIONS':
        return '', 200
        
    # JWT validation for non-OPTIONS
    current_user_id = get_jwt_identity()
    if not current_user_id:
        return jsonify({'error': 'Authentication required'}), 401
        
    perm = Permission.query.get_or_404(perm_id)
    db.session.delete(perm)
    db.session.commit()
    return '', 204

# ----- Debug endpoints -----
@admin_bp.route('/debug-token', methods=['GET', 'OPTIONS'])
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True, allow_headers=["Authorization", "Content-Type"])
def debug_token():
    """Debug endpoint to analyze JWT tokens"""
    if request.method == 'OPTIONS':
        return '', 200
        
    try:
        # Get and print auth header
        auth_header = request.headers.get('Authorization')
        print(f"Authorization header: {auth_header}")
        
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({
                'error': 'Missing or invalid Authorization header',
                'header_received': auth_header
            }), 400
            
        # Extract token
        token = auth_header.split(' ')[1]
        
        # Import token decoding functions
        from flask_jwt_extended import decode_token
        import jwt
        from jwt.exceptions import PyJWTError
        
        # Try to decode with PyJWT first (raw decoding)
        raw_decode_error = None
        raw_token_data = None
        try:
            # First try without verification
            raw_token_data = jwt.decode(token, options={"verify_signature": False})
        except PyJWTError as e:
            raw_decode_error = str(e)
        
        # Try to decode with flask_jwt_extended (integrated with our app)
        flask_jwt_error = None
        flask_jwt_data = None
        try:
            flask_jwt_data = decode_token(token)
        except Exception as e:
            flask_jwt_error = str(e)
            
        # Return all debug information
        return jsonify({
            'token': token,
            'token_type': auth_header.split(' ')[0] if auth_header else None,
            'raw_decoded_data': raw_token_data,
            'raw_decode_error': raw_decode_error,
            'flask_jwt_decoded_data': flask_jwt_data,
            'flask_jwt_error': flask_jwt_error,
            'header_structure': 'Valid Bearer format' if auth_header and auth_header.startswith('Bearer ') else 'Invalid format'
        })
    except Exception as e:
        print(f"Error in debug-token: {str(e)}")
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

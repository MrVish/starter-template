from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import (
    create_access_token, 
    create_refresh_token, 
    jwt_required, 
    get_jwt_identity
)
from datetime import datetime, timedelta
import logging
from models.dim_users import DimUser
from models.dim_roles import DimRole
from extensions import db
from flask_cors import cross_origin

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST', 'OPTIONS'])
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True, allow_headers=["Authorization", "Content-Type"])
def register():
    """Register a new user"""
    if request.method == 'OPTIONS':
        return '', 200
        
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['username', 'email', 'password']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    # Check if user already exists
    if DimUser.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 400
    
    if DimUser.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already taken'}), 400
    
    # Create new user
    new_user = DimUser(
        username=data['username'],
        email=data['email'],
        first_name=data.get('first_name', ''),
        last_name=data.get('last_name', ''),
        is_active=True,
        created_at=datetime.utcnow()
    )
    
    new_user.set_password(data['password'])
    
    # Assign default role (User)
    default_role = DimRole.query.filter_by(is_default=True).first() or DimRole.query.filter_by(name='User').first()
    if default_role:
        new_user.add_role(default_role)
    
    db.session.add(new_user)
    db.session.commit()
    
    # Generate tokens
    access_token = create_access_token(identity=new_user.id)
    refresh_token = create_refresh_token(identity=new_user.id)
    
    return jsonify({
        'message': 'User registered successfully',
        'user': {
            'id': new_user.id,
            'username': new_user.username,
            'email': new_user.email,
            'full_name': new_user.full_name,
            'roles': new_user.get_role_names()
        },
        'access_token': access_token,
        'refresh_token': refresh_token
    }), 201

@auth_bp.route('/login', methods=['POST', 'OPTIONS'])
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True, allow_headers=["Authorization", "Content-Type"])
def login():
    """Login with email or username and password"""
    if request.method == 'OPTIONS':
        return '', 200
        
    data = request.get_json()
    
    # Validate required fields
    if not (data.get('email') or data.get('username')) or not data.get('password'):
        return jsonify({'error': 'Email/username and password are required'}), 400
    
    # Find user by email or username
    user = None
    if data.get('email'):
        user = DimUser.query.filter_by(email=data['email']).first()
    elif data.get('username'):
        user = DimUser.query.filter_by(username=data['username']).first()
    
    # Debug information
    logger.info(f"Login attempt for user: {data.get('email') or data.get('username')}")
    logger.info(f"User found: {user is not None}")
    
    # Verify user exists and password is correct
    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    # Check if user is active
    if not user.is_active:
        return jsonify({'error': 'Account is inactive'}), 401
    
    # Update last login time
    user.last_login_at = datetime.utcnow()
    db.session.commit()
    
    # Generate tokens
    access_token = create_access_token(
        identity=user.id,
        additional_claims={
            'roles': user.get_role_names(),
            'email': user.email,
            'username': user.username
        }
    )
    refresh_token = create_refresh_token(identity=user.id)
    
    return jsonify({
        'message': 'Login successful',
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'full_name': user.full_name,
            'roles': user.get_role_names()
        },
        'access_token': access_token,
        'refresh_token': refresh_token
    }), 200

@auth_bp.route('/refresh', methods=['POST', 'OPTIONS'])
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True, allow_headers=["Authorization", "Content-Type"])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token"""
    if request.method == 'OPTIONS':
        return '', 200
        
    identity = get_jwt_identity()
    
    # Get user information for additional claims
    user = DimUser.query.get(identity)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    if not user.is_active:
        return jsonify({'error': 'Account is inactive'}), 401
    
    # Generate new access token with additional claims
    access_token = create_access_token(
        identity=identity,
        additional_claims={
            'roles': user.get_role_names(),
            'email': user.email,
            'username': user.username
        }
    )
    
    return jsonify({
        'access_token': access_token
    }), 200

@auth_bp.route('/user-info', methods=['GET', 'OPTIONS'])
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True, allow_headers=["Authorization", "Content-Type"])
@jwt_required()
def user_info():
    """Get current user information"""
    if request.method == 'OPTIONS':
        return '', 200
        
    user_id = get_jwt_identity()
    user = DimUser.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({
        'user': user.to_dict()
    }), 200

@auth_bp.route('/check-auth', methods=['GET', 'OPTIONS'])
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True, allow_headers=["Authorization", "Content-Type"])
@jwt_required(optional=True)
def check_auth():
    """Check if user is authenticated"""
    if request.method == 'OPTIONS':
        return '', 200
        
    user_id = get_jwt_identity()
    
    if user_id:
        user = DimUser.query.get(user_id)
        if user:
            return jsonify({
                'authenticated': True,
                'user': user.to_dict()
            }), 200
    
    return jsonify({
        'authenticated': False
    }), 200 
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
    
    # Convert tokens to strings if they are bytes
    if isinstance(access_token, bytes):
        access_token = access_token.decode('utf-8')
    if isinstance(refresh_token, bytes):
        refresh_token = refresh_token.decode('utf-8')
    
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
        logger.info("Handling OPTIONS request for /login")
        return '', 200
        
    # Log the request for debugging
    logger.info(f"Login request received: Headers: {request.headers}")
    
    # Get raw request data for debugging
    raw_data = request.get_data().decode('utf-8')
    logger.info(f"Raw request data: {raw_data}")
    
    # Parse JSON data with detailed error handling
    try:
        data = request.get_json()
        if data is None:
            logger.error("No JSON data provided or Content-Type header is not application/json")
            return jsonify({
                'success': False,
                'error': 'No JSON data provided or Content-Type header is not application/json'
            }), 400
            
        logger.info(f"Parsed JSON data: {data}")
    except Exception as e:
        logger.error(f"Error parsing JSON data: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Invalid JSON data: {str(e)}'
        }), 400
    
    # Handle both email and username fields
    email = data.get('email')
    username = data.get('username')
    password = data.get('password')
    
    logger.info(f"Login attempt with: email={email}, username={username}, password={'*' * len(password) if password else None}")
    
    if not password:
        logger.error("Password missing from request")
        return jsonify({
            'success': False,
            'error': 'Password is required'
        }), 400
    
    if not email and not username:
        logger.error("Both email and username missing from request")
        return jsonify({
            'success': False,
            'error': 'Email or username is required'
        }), 400
    
    # Find user by email or username
    user = None
    if email:
        logger.info(f"Attempting login by email: {email}")
        user = DimUser.query.filter_by(email=email).first()
    
    if not user and username:
        logger.info(f"Email login failed or not provided, trying username: {username}")
        user = DimUser.query.filter_by(username=username).first()
    
    # Debug information
    logger.info(f"User found: {user is not None}")
    
    # For development purposes, simplify authentication for test accounts
    if email == "test@example.com" and password == "password":
        logger.info("Test account login detected, using admin account")
        user = DimUser.query.filter_by(is_admin=True).first()
    
    # Verify user exists
    if not user:
        logger.warning(f"User not found: {email or username}")
        return jsonify({
            'success': False,
            'error': 'Invalid credentials'
        }), 401
    
    # Check password
    if not user.check_password(password):
        logger.warning(f"Invalid password for user: {user.username}")
        return jsonify({
            'success': False,
            'error': 'Invalid credentials'
        }), 401
    
    # Check if user is active
    if not user.is_active:
        logger.warning(f"Inactive account: {user.username}")
        return jsonify({
            'success': False,
            'error': 'Account is inactive'
        }), 401
    
    # Update last login time
    user.last_login_at = datetime.utcnow()
    db.session.commit()
    
    # Generate tokens
    try:
        access_token = create_access_token(
            identity=user.id,
            additional_claims={
                'roles': user.get_role_names(),
                'email': user.email,
                'username': user.username
            }
        )
        refresh_token = create_refresh_token(identity=user.id)
        
        # Convert tokens to strings if they are bytes
        if isinstance(access_token, bytes):
            access_token = access_token.decode('utf-8')
        if isinstance(refresh_token, bytes):
            refresh_token = refresh_token.decode('utf-8')
        
        logger.info(f"Successful login for user: {user.username}")
        
        # Return a complete response with all fields needed by the frontend
        response_data = {
            'success': True,
            'message': 'Login successful',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'full_name': user.full_name,
                'roles': user.get_role_names(),
                'is_admin': user.is_admin
            },
            'access_token': access_token,
            'refresh_token': refresh_token,
            # Add fields specifically for NextAuth compatibility
            'id': user.id,
            'name': user.username,
            'email': user.email
        }
        
        logger.info(f"Response data: {response_data}")
        return jsonify(response_data), 200
    except Exception as e:
        logger.error(f"Error generating tokens: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Authentication error: {str(e)}'
        }), 500

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
    
    # Convert token to string if it is bytes
    if isinstance(access_token, bytes):
        access_token = access_token.decode('utf-8')
    
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
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import (
    create_access_token, 
    create_refresh_token, 
    jwt_required, 
    get_jwt_identity
)
from werkzeug.security import generate_password_hash, check_password_hash
import requests
from models.user import User
from extensions import db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['username', 'email', 'password']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    # Check if user already exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 400
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already taken'}), 400
    
    # Create new user
    new_user = User(
        username=data['username'],
        email=data['email'],
        password_hash=generate_password_hash(data['password']),
        first_name=data.get('first_name', ''),
        last_name=data.get('last_name', '')
    )
    
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
            'email': new_user.email
        },
        'access_token': access_token,
        'refresh_token': refresh_token
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login with email and password"""
    data = request.get_json()
    
    # Validate required fields
    if not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password are required'}), 400
    
    # Find user by email
    user = User.query.filter_by(email=data['email']).first()
    
    # Debug information
    print(f"Login attempt for email: {data['email']}")
    print(f"User found: {user is not None}")
    if user:
        print(f"User password hash: {user.password_hash}")
        print(f"Password check result: {check_password_hash(user.password_hash, data['password'])}")
    
    # Verify user exists and password is correct
    if not user or not check_password_hash(user.password_hash, data['password']):
        return jsonify({'error': 'Invalid email or password'}), 401
    
    # Generate tokens
    access_token = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)
    
    return jsonify({
        'message': 'Login successful',
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email
        },
        'access_token': access_token,
        'refresh_token': refresh_token
    }), 200

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token"""
    identity = get_jwt_identity()
    access_token = create_access_token(identity=identity)
    
    return jsonify({
        'access_token': access_token
    }), 200

@auth_bp.route('/oauth/google', methods=['POST'])
def oauth_google():
    """Authenticate with Google OAuth"""
    data = request.get_json()
    token = data.get('token')
    
    if not token:
        return jsonify({'error': 'Token is required'}), 400
    
    # Verify token with Google
    google_response = requests.get(
        'https://www.googleapis.com/oauth2/v3/tokeninfo',
        params={'id_token': token}
    )
    
    if not google_response.ok:
        return jsonify({'error': 'Invalid Google token'}), 401
    
    google_data = google_response.json()
    email = google_data.get('email')
    
    # Find user by email or create new one
    user = User.query.filter_by(email=email).first()
    
    if not user:
        # Create new user from Google data
        user = User(
            username=email.split('@')[0],  # Use first part of email as username
            email=email,
            first_name=google_data.get('given_name', ''),
            last_name=google_data.get('family_name', ''),
            oauth_provider='google',
            oauth_id=google_data.get('sub')
        )
        db.session.add(user)
        db.session.commit()
    
    # Generate tokens
    access_token = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)
    
    return jsonify({
        'message': 'Google login successful',
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email
        },
        'access_token': access_token,
        'refresh_token': refresh_token
    }), 200

@auth_bp.route('/oauth/azure', methods=['POST'])
def oauth_azure():
    """Authenticate with Azure AD (for SSO)"""
    data = request.get_json()
    token = data.get('token')
    
    if not token:
        return jsonify({'error': 'Token is required'}), 400
    
    # Azure config
    azure_config = current_app.config['OAUTH_CREDENTIALS']['azure']
    tenant_id = azure_config.get('tenant')
    
    # Verify token with Azure AD
    azure_response = requests.get(
        f'https://graph.microsoft.com/v1.0/me',
        headers={'Authorization': f'Bearer {token}'}
    )
    
    if not azure_response.ok:
        return jsonify({'error': 'Invalid Azure token'}), 401
    
    azure_data = azure_response.json()
    email = azure_data.get('mail') or azure_data.get('userPrincipalName')
    
    # Find user by email or create new one
    user = User.query.filter_by(email=email).first()
    
    if not user:
        # Create new user from Azure data
        user = User(
            username=email.split('@')[0],  # Use first part of email as username
            email=email,
            first_name=azure_data.get('givenName', ''),
            last_name=azure_data.get('surname', ''),
            oauth_provider='azure',
            oauth_id=azure_data.get('id')
        )
        db.session.add(user)
        db.session.commit()
    
    # Generate tokens
    access_token = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)
    
    return jsonify({
        'message': 'Azure AD login successful',
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email
        },
        'access_token': access_token,
        'refresh_token': refresh_token
    }), 200 
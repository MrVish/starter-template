from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.dim_users import DimUser
from extensions import db
from flask_cors import cross_origin

# Import custom JWT decorator from admin module
from api.admin import custom_jwt_required, get_current_user

users_bp = Blueprint('users', __name__)

@users_bp.route('/', methods=['GET'])
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True, allow_headers=["Authorization", "Content-Type"])
@custom_jwt_required()
def get_users():
    """Get all users (admin only)"""
    # Get current user from our decorator
    current_user = get_current_user()
    
    # Check admin permissions
    if not current_user or not any(r.name.lower() in ['administrator', 'admin'] for r in current_user.roles):
        return jsonify({'error': 'Unauthorized - Admin access required'}), 403
    
    users = DimUser.query.all()
    
    users_data = [{
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'role': user.role,
        'created_at': user.created_at.isoformat() if user.created_at else None
    } for user in users]
    
    return jsonify({'users': users_data}), 200

@users_bp.route('/profile', methods=['GET', 'OPTIONS'])
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True, allow_headers=["Authorization", "Content-Type", "X-Requested-With", "Accept"])
def get_profile():
    """Get current user profile"""
    # Handle OPTIONS request first
    if request.method == 'OPTIONS':
        return '', 200
    
    # For GET requests, verify authentication
    try:
        # Get current user from our decorator
        current_user = get_current_user()
        
        if not current_user:
            # Return a mock profile for development/debugging
            # Remove this in production
            mock_profile = {
                'id': 1,
                'username': 'user',
                'email': 'user@example.com',
                'first_name': 'Test',
                'last_name': 'User',
                'roles': ['user'],
                'created_at': None
            }
            return jsonify(mock_profile), 200
            # Uncomment for production:
            # return jsonify({'error': 'User not found'}), 404
        
        # Include roles in response
        roles = [role.name for role in current_user.roles] if current_user.roles else []
        
        return jsonify({
            'id': current_user.id,
            'username': current_user.username,
            'email': current_user.email,
            'first_name': current_user.first_name,
            'last_name': current_user.last_name,
            'roles': roles,
            'created_at': current_user.created_at.isoformat() if current_user.created_at else None
        }), 200
    except Exception as e:
        print(f"Error getting user profile: {str(e)}")
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

@users_bp.route('/profile', methods=['PUT', 'OPTIONS'])
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True, allow_headers=["Authorization", "Content-Type"])
@custom_jwt_required()
def update_profile():
    """Update current user profile"""
    # Handle OPTIONS request
    if request.method == 'OPTIONS':
        return '', 200
        
    # Get current user from our decorator
    current_user = get_current_user()
    
    if not current_user:
        return jsonify({'error': 'User not found'}), 404
    
    data = request.get_json()
    
    # Update fields if provided
    if 'first_name' in data:
        current_user.first_name = data['first_name']
    if 'last_name' in data:
        current_user.last_name = data['last_name']
    if 'username' in data:
        # Check if username is already taken
        if DimUser.query.filter_by(username=data['username']).first() and data['username'] != current_user.username:
            return jsonify({'error': 'Username already taken'}), 400
        current_user.username = data['username']
    
    db.session.commit()
    
    return jsonify({
        'message': 'Profile updated successfully',
        'user': {
            'id': current_user.id,
            'username': current_user.username,
            'email': current_user.email,
            'first_name': current_user.first_name,
            'last_name': current_user.last_name
        }
    }), 200

@users_bp.route('/<int:user_id>', methods=['GET', 'OPTIONS'])
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True, allow_headers=["Authorization", "Content-Type"])
@custom_jwt_required()
def get_user(user_id):
    """Get user by ID (admin only or self)"""
    # Get current user from our decorator
    current_user = get_current_user()
    
    # Check if user is admin or self
    if not current_user or (not any(r.name.lower() in ['administrator', 'admin'] for r in current_user.roles) and current_user.id != user_id):
        return jsonify({'error': 'Unauthorized access'}), 403
    
    user = DimUser.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'role': user.role,
        'created_at': user.created_at.isoformat() if user.created_at else None
    }), 200 
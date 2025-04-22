from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/', methods=['GET'])
@jwt_required()
def get_dashboard():
    """Get dashboard data for the authenticated user"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # This is a placeholder for actual dashboard data
    # In a real application, you would query relevant data based on the user's role and permissions
    
    # Sample data for demonstration
    dashboard_data = {
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role
        },
        'stats': {
            'projects': 5,
            'tasks': 23,
            'completed': 12,
            'pending': 11
        },
        'recent_activity': [
            {
                'id': 1,
                'type': 'task',
                'action': 'created',
                'name': 'Risk Assessment Review',
                'date': '2023-11-01T10:30:00Z'
            },
            {
                'id': 2,
                'type': 'document',
                'action': 'uploaded',
                'name': 'Q3 Model Performance Report',
                'date': '2023-10-28T14:45:00Z'
            },
            {
                'id': 3,
                'type': 'project',
                'action': 'updated',
                'name': 'Marketing Campaign Analysis',
                'date': '2023-10-25T09:15:00Z'
            }
        ]
    }
    
    # Add role-specific data
    if user.role == 'admin':
        dashboard_data['admin'] = {
            'total_users': User.query.count(),
            'system_status': 'healthy',
            'pending_approvals': 3
        }
    elif user.role == 'analyst':
        dashboard_data['models'] = [
            {
                'id': 1,
                'name': 'Credit Risk Model',
                'status': 'active',
                'last_validated': '2023-09-15T00:00:00Z'
            },
            {
                'id': 2,
                'name': 'Customer Churn Predictor',
                'status': 'under review',
                'last_validated': '2023-10-10T00:00:00Z'
            }
        ]
    
    return jsonify(dashboard_data), 200

@dashboard_bp.route('/summary', methods=['GET'])
@jwt_required()
def get_summary():
    """Get a summary of key metrics for the dashboard"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Placeholder metrics data
    metrics = {
        'key_metrics': [
            {
                'name': 'Active Projects',
                'value': 7,
                'change': 2,
                'change_type': 'increase'
            },
            {
                'name': 'Risk Assessments',
                'value': 12,
                'change': -1,
                'change_type': 'decrease'
            },
            {
                'name': 'Model Validations',
                'value': 5,
                'change': 0,
                'change_type': 'neutral'
            },
            {
                'name': 'Open Issues',
                'value': 3,
                'change': -2,
                'change_type': 'decrease'
            }
        ]
    }
    
    return jsonify(metrics), 200 
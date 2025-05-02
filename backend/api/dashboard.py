from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from services.dashboard_service import DashboardService
from extensions import db, jwt
from models.dim_users import DimUser
from flask_cors import cross_origin
import logging

# Set up logging
logger = logging.getLogger(__name__)

dashboard_bp = Blueprint('dashboard', __name__)
dashboard_service = DashboardService(db.session)

@dashboard_bp.route('/', methods=['GET', 'OPTIONS'])
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True, allow_headers=["Authorization", "Content-Type"])
@jwt_required(optional=True)
def get_dashboard():
    """Get dashboard data for the authenticated user or mock data for unauthenticated users"""
    if request.method == 'OPTIONS':
        logger.info("Handling OPTIONS request for dashboard")
        return '', 200
        
    try:
        # Check if user is authenticated
        current_user_id = get_jwt_identity()
        logger.info(f"Dashboard requested. User authenticated: {current_user_id is not None}")
        
        if current_user_id:
            # User is authenticated, get real data
            user = DimUser.query.get(current_user_id)
            
            if not user:
                # User ID is valid but not found in database
                logger.warning(f"User with ID {current_user_id} not found, using mock data")
                dashboard_data = dashboard_service._get_mock_dashboard_data(0)
            else:
                # Get dashboard data for authenticated user
                dashboard_data = dashboard_service.get_dashboard_summary(user.id)
        else:
            # User is not authenticated or token is expired, return mock data
            logger.info("No authentication provided, using mock data")
            dashboard_data = dashboard_service._get_mock_dashboard_data(0)
        
        return jsonify({
            'success': True,
            'data': dashboard_data
        }), 200
    except Exception as e:
        logger.error(f"Error in get_dashboard: {str(e)}")
        return jsonify({
            'success': False, 
            'message': str(e),
            'data': dashboard_service._get_mock_dashboard_data(0)  # Return mock data even on error
        }), 200  # Return 200 with mock data instead of 500 error

@dashboard_bp.route('/stats', methods=['GET', 'OPTIONS'])
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True, allow_headers=["Authorization", "Content-Type"])
@jwt_required(optional=True)
def get_dashboard_stats():
    """Get key statistics for the dashboard"""
    if request.method == 'OPTIONS':
        return '', 200
        
    try:
        stats = dashboard_service.get_key_stats()
        
        return jsonify({
            'success': True,
            'data': stats
        }), 200
    except Exception as e:
        logger.error(f"Error in get_dashboard_stats: {str(e)}")
        return jsonify({
            'success': False,
            'message': str(e),
            'data': dashboard_service.get_key_stats()  # Attempt to get stats again
        }), 200

@dashboard_bp.route('/campaigns/recent', methods=['GET', 'OPTIONS'])
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True, allow_headers=["Authorization", "Content-Type"])
@jwt_required(optional=True)
def get_recent_campaigns():
    """Get recent campaigns for the dashboard"""
    if request.method == 'OPTIONS':
        return '', 200
        
    try:
        limit = request.args.get('limit', 5, type=int)
        campaigns = dashboard_service.get_recent_campaigns(limit=limit)
        
        return jsonify({
            'success': True,
            'data': campaigns
        }), 200
    except Exception as e:
        logger.error(f"Error in get_recent_campaigns: {str(e)}")
        limit = request.args.get('limit', 5, type=int)
        return jsonify({
            'success': False,
            'message': str(e),
            'data': dashboard_service.get_recent_campaigns(limit=limit)  # Get mock campaigns data
        }), 200

@dashboard_bp.route('/segments', methods=['GET', 'OPTIONS'])
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True, allow_headers=["Authorization", "Content-Type"])
@jwt_required(optional=True)
def get_audience_segments():
    """Get audience segments for the dashboard"""
    if request.method == 'OPTIONS':
        return '', 200
        
    try:
        limit = request.args.get('limit', 4, type=int)
        segments = dashboard_service.get_audience_segments(limit=limit)
        
        return jsonify({
            'success': True,
            'data': segments
        }), 200
    except Exception as e:
        logger.error(f"Error in get_audience_segments: {str(e)}")
        limit = request.args.get('limit', 4, type=int)
        return jsonify({
            'success': False,
            'message': str(e),
            'data': dashboard_service.get_audience_segments(limit=limit)  # Get mock segments data
        }), 200

@dashboard_bp.route('/channels', methods=['GET', 'OPTIONS'])
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True, allow_headers=["Authorization", "Content-Type"])
@jwt_required(optional=True)
def get_channel_performance():
    """Get channel performance data for the dashboard"""
    if request.method == 'OPTIONS':
        return '', 200
        
    try:
        channels = dashboard_service.get_channel_performance()
        
        return jsonify({
            'success': True,
            'data': channels
        }), 200
    except Exception as e:
        logger.error(f"Error in get_channel_performance: {str(e)}")
        return jsonify({
            'success': False,
            'message': str(e),
            'data': dashboard_service._get_mock_channel_performance()  # Get mock channel data
        }), 200

@dashboard_bp.route('/funnel', methods=['GET', 'OPTIONS'])
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True, allow_headers=["Authorization", "Content-Type"])
@jwt_required(optional=True)
def get_conversion_funnel():
    """Get conversion funnel data for the dashboard"""
    if request.method == 'OPTIONS':
        return '', 200
        
    try:
        funnel = dashboard_service.get_conversion_funnel()
        
        return jsonify({
            'success': True,
            'data': funnel
        }), 200
    except Exception as e:
        logger.error(f"Error in get_conversion_funnel: {str(e)}")
        return jsonify({
            'success': False,
            'message': str(e),
            'data': dashboard_service.get_conversion_funnel()  # Get mock funnel data
        }), 200

@dashboard_bp.route('/campaign', methods=['POST', 'OPTIONS'])
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True, allow_headers=["Authorization", "Content-Type"])
@jwt_required()
def create_campaign():
    """Create a new campaign"""
    if request.method == 'OPTIONS':
        return '', 200
        
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'message': 'No data provided'}), 400
            
        # Validate required fields
        required_fields = ['name', 'type', 'budget', 'startDate', 'endDate']
        for field in required_fields:
            if field not in data:
                return jsonify({'success': False, 'message': f'Missing required field: {field}'}), 400
        
        # Create campaign using service
        result = dashboard_service.create_campaign(data)
        
        return jsonify({
            'success': True,
            'data': result,
            'message': 'Campaign created successfully'
        }), 201
    except Exception as e:
        logger.error(f"Error in create_campaign: {str(e)}")
        # For write operations, we don't return mock data
        return jsonify({'success': False, 'message': str(e)}), 500

@dashboard_bp.route('/segment', methods=['POST', 'OPTIONS'])
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True, allow_headers=["Authorization", "Content-Type"])
@jwt_required()
def create_segment():
    """Create a new audience segment"""
    if request.method == 'OPTIONS':
        return '', 200
        
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'message': 'No data provided'}), 400
            
        # Validate required fields
        required_fields = ['name', 'criteria']
        for field in required_fields:
            if field not in data:
                return jsonify({'success': False, 'message': f'Missing required field: {field}'}), 400
        
        # Create segment using service
        result = dashboard_service.create_segment(data)
        
        return jsonify({
            'success': True,
            'data': result,
            'message': 'Segment created successfully'
        }), 201
    except Exception as e:
        logger.error(f"Error in create_segment: {str(e)}")
        # For write operations, we don't return mock data
        return jsonify({'success': False, 'message': str(e)}), 500 
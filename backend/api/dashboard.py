from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from services.dashboard_service import DashboardService
from extensions import db, jwt
from models.dim_users import DimUser
import logging

# Set up logging
logger = logging.getLogger(__name__)

dashboard_bp = Blueprint('dashboard', __name__)
dashboard_service = DashboardService(db.session)

@dashboard_bp.route('/', methods=['GET', 'OPTIONS'])
def get_dashboard():
    """Get dashboard data for the authenticated user or mock data for unauthenticated users"""
    # Wrap the route with our custom decorator at runtime
    return current_app.jwt_cors_optional(get_dashboard_impl)()

def get_dashboard_impl():
    """Implementation of the dashboard endpoint logic"""
    try:
        # Check if user is authenticated
        try:
            # First properly verify the JWT token
            verify_jwt_in_request(optional=True)
            current_user_id = get_jwt_identity()
        except Exception as e:
            logger.warning(f"JWT authentication error: {str(e)}")
            current_user_id = None
            
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
def get_dashboard_stats():
    """Get key statistics for the dashboard"""
    # Wrap with custom decorator
    return current_app.jwt_cors_optional(get_dashboard_stats_impl)()
    
def get_dashboard_stats_impl():
    """Get dashboard stats implementation"""
    try:
        # First properly verify the JWT token
        try:
            verify_jwt_in_request(optional=True)
        except Exception as e:
            logger.warning(f"JWT authentication error in stats: {str(e)}")
        
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
def get_recent_campaigns():
    """Get recent campaigns for the dashboard"""
    return current_app.jwt_cors_optional(get_recent_campaigns_impl)()
    
def get_recent_campaigns_impl():
    """Recent campaigns implementation"""
    try:
        # First properly verify the JWT token
        try:
            verify_jwt_in_request(optional=True)
        except Exception as e:
            logger.warning(f"JWT authentication error in recent campaigns: {str(e)}")
            
        limit = request.args.get('limit', 5, type=int)
        # New parameter to control mock data behavior
        use_mock_data = request.args.get('use_mock_data', 'true').lower() == 'true'
        
        logger.info(f"Recent campaigns API called with limit={limit}, use_mock_data={use_mock_data}")
        
        try:
            # Try to get campaigns from database with mock data setting
            campaigns = dashboard_service.get_recent_campaigns(limit=limit, use_mock_data=use_mock_data)
            logger.info(f"Successfully retrieved {len(campaigns)} campaigns")
            
            return jsonify({
                'success': True,
                'data': {
                    'campaigns': campaigns
                }
            }), 200
        except Exception as e:
            error_msg = f"Failed to fetch campaigns: {str(e)}"
            logger.error(error_msg)
            
            if not use_mock_data:
                # If mock data is disabled, return the actual error
                return jsonify({
                    'success': False,
                    'error': error_msg,
                    'data': {
                        'campaigns': []
                    }
                }), 500
            else:
                # If mock data is enabled, return mock data
                mock_campaigns = dashboard_service._get_mock_campaign_data(limit)
                logger.info(f"Returning {len(mock_campaigns)} mock campaigns after error")
                
                return jsonify({
                    'success': True,
                    'message': "Using fallback mock data due to error",
                    'data': {
                        'campaigns': mock_campaigns
                    }
                }), 200
    except Exception as e:
        # This is for unexpected errors in the API endpoint itself
        logger.error(f"Unexpected error in get_recent_campaigns endpoint: {str(e)}")
        return jsonify({
            'success': False, 
            'error': str(e), 
            'data': {
                'campaigns': []
            }
        }), 500

@dashboard_bp.route('/segments', methods=['GET', 'OPTIONS'])
def get_audience_segments():
    """Get audience segments for the dashboard"""
    return current_app.jwt_cors_optional(get_audience_segments_impl)()
    
def get_audience_segments_impl():
    """Get audience segments implementation"""
    try:
        # First properly verify the JWT token
        try:
            verify_jwt_in_request(optional=True)
        except Exception as e:
            logger.warning(f"JWT authentication error in audience segments: {str(e)}")
            
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
def get_channel_performance():
    """Get channel performance data for the dashboard"""
    return current_app.jwt_cors_optional(get_channel_performance_impl)()
    
def get_channel_performance_impl():
    """Get channel performance implementation"""
    try:
        # First properly verify the JWT token
        try:
            verify_jwt_in_request(optional=True)
        except Exception as e:
            logger.warning(f"JWT authentication error in channel performance: {str(e)}")
            
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
def get_conversion_funnel():
    """Get conversion funnel data for the dashboard"""
    return current_app.jwt_cors_optional(get_conversion_funnel_impl)()
    
def get_conversion_funnel_impl():
    """Get conversion funnel implementation"""
    try:
        # First properly verify the JWT token
        try:
            verify_jwt_in_request(optional=True)
        except Exception as e:
            logger.warning(f"JWT authentication error in conversion funnel: {str(e)}")
            
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
def create_campaign():
    """Create a new campaign"""
    return current_app.jwt_cors_optional(create_campaign_impl)()
    
def create_campaign_impl():
    """Create campaign implementation"""
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
def create_segment():
    """Create a new audience segment"""
    return current_app.jwt_cors_optional(create_segment_impl)()
    
def create_segment_impl():
    """Create segment implementation"""
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
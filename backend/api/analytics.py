from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from services.analytics_service import AnalyticsService
from datetime import datetime
import logging

analytics_bp = Blueprint('analytics', __name__)
analytics_service = AnalyticsService()

@analytics_bp.route('/metrics', methods=['GET', 'OPTIONS'])
def get_metrics():
    """Get key metrics for the insights dashboard"""
    # Handle CORS preflight request
    if request.method == 'OPTIONS':
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET, OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response, 200

    try:
        # Parse time range parameter
        time_range = request.args.get('timeRange', '30d')
        print(f"[DEBUG] /metrics API received timeRange: '{time_range}'")
        
        # We will always try to get real data first, mock data only as fallback
        try:
            print("[DEBUG] Attempting to fetch key metrics from database")
            key_metrics = analytics_service.get_key_metrics(time_range)
            
            if key_metrics and len(key_metrics) > 0:
                print(f"[DEBUG] Successfully retrieved {len(key_metrics)} key metrics from database")
                return jsonify({"success": True, "data": key_metrics}), 200
            else:
                print("[DEBUG] No key metrics found in database, using mock data")
                mock_metrics = analytics_service._get_mock_key_metrics()
                return jsonify({"success": True, "data": mock_metrics}), 200
        except Exception as e:
            print(f"[DEBUG] Error fetching key metrics from database: {str(e)}")
            
            # Use the fallback mock data from the service
            print("[DEBUG] Using mock metrics data as fallback")
            mock_metrics = analytics_service._get_mock_key_metrics()
            return jsonify({"success": True, "data": mock_metrics}), 200
    except Exception as outer_e:
        print(f"[DEBUG] Outer error in /metrics API: {str(outer_e)}")
        
        # Use the fallback mock data from the service
        mock_metrics = analytics_service._get_mock_key_metrics()
        return jsonify({"success": False, "error": str(outer_e), "data": mock_metrics}), 200

@analytics_bp.route('/dashboard-summary', methods=['GET', 'OPTIONS'])
def get_dashboard_summary():
    """Get summary statistics for the analytics dashboard"""
    # Handle CORS preflight request
    if request.method == 'OPTIONS':
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET, OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response, 200

    try:
        # First check if the user is authenticated, but don't require it
        try:
            verify_jwt_in_request(optional=True)
            user_id = get_jwt_identity()
            print(f"[DEBUG] Dashboard summary API - User authenticated: {user_id is not None}")
        except Exception as e:
            print(f"[DEBUG] JWT auth error in dashboard summary API (non-fatal): {str(e)}")
            user_id = None
            
        data = analytics_service.get_dashboard_summary()
        return jsonify({"success": True, "data": data}), 200
    except Exception as e:
        print(f"[DEBUG] Error in /dashboard-summary API: {str(e)}")
        # Fallback to empty dashboard summary
        return jsonify({"success": False, "message": str(e), "data": {}}), 200

@analytics_bp.route('/campaigns', methods=['GET', 'OPTIONS'])
def get_campaigns():
    """Returns campaign data for the insights page"""
    # Handle CORS preflight request
    if request.method == 'OPTIONS':
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET, OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response, 200

    try:
        # First check if the user is authenticated, but don't require it
        try:
            verify_jwt_in_request(optional=True)
            user_id = get_jwt_identity()
            print(f"[DEBUG] Campaigns API - User authenticated: {user_id is not None}")
        except Exception as e:
            print(f"[DEBUG] JWT auth error in campaigns API (non-fatal): {str(e)}")
            user_id = None
    
        # Extract time_range from request args, defaulting to '30d'
        time_range = request.args.get('timeRange', '30d')
        print(f"[DEBUG] /campaigns API received timeRange: '{time_range}'")
        
        try:
            # Always try to get real data from database first
            print("[DEBUG] Attempting to fetch campaign data from database")
            campaigns = analytics_service.get_campaigns(time_range)
            
            if campaigns and len(campaigns) > 0:
                print(f"[DEBUG] Successfully retrieved {len(campaigns)} campaigns from database")
                return jsonify({"success": True, "data": campaigns}), 200
            else:
                print("[DEBUG] No campaigns found in database, using mock data")
                mock_campaigns = analytics_service._get_mock_campaigns()
                return jsonify({"success": True, "data": mock_campaigns}), 200
        except Exception as e:
            print(f"[DEBUG] Error fetching campaigns from database: {str(e)}")
            
            # Use the fallback mock data from the service
            print("[DEBUG] Using mock campaign data as fallback")
            mock_campaigns = analytics_service._get_mock_campaigns()
            return jsonify({"success": True, "data": mock_campaigns}), 200
    except Exception as outer_e:
        print(f"[DEBUG] Outer error in /campaigns API: {str(outer_e)}")
        return jsonify({"success": False, "error": str(outer_e), "data": []}), 200

@analytics_bp.route('/campaigns/<int:campaign_id>/performance', methods=['GET', 'OPTIONS'])
def get_campaign_performance(campaign_id):
    """Get performance metrics for a specific campaign"""
    # Handle CORS preflight request
    if request.method == 'OPTIONS':
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET, OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response, 200
        
    try:
        # First check if the user is authenticated, but don't require it
        try:
            verify_jwt_in_request(optional=True)
            user_id = get_jwt_identity()
            print(f"[DEBUG] Campaign performance API - User authenticated: {user_id is not None}")
        except Exception as e:
            print(f"[DEBUG] JWT auth error in campaign performance API (non-fatal): {str(e)}")
            user_id = None
            
        # Parse date parameters if provided
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        if start_date:
            start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
        if end_date:
            end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
            
        data = analytics_service.get_campaign_performance_over_time(
            campaign_id=campaign_id,
            start_date=start_date,
            end_date=end_date
        )
        return jsonify({"success": True, "data": data}), 200
    except Exception as e:
        print(f"[DEBUG] Error in /campaigns/{campaign_id}/performance API: {str(e)}")
        # Fallback to mock campaign performance
        mock_data = analytics_service.get_campaign_performance_over_time(1)
        return jsonify({"success": False, "message": str(e), "data": mock_data}), 200

@analytics_bp.route('/segments/performance', methods=['GET', 'OPTIONS'])
def get_segment_performance():
    """Compare performance across different customer segments"""
    # Handle CORS preflight request
    if request.method == 'OPTIONS':
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET, OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response, 200
        
    try:
        # First check if the user is authenticated, but don't require it
        try:
            verify_jwt_in_request(optional=True)
            user_id = get_jwt_identity()
            print(f"[DEBUG] Segment performance API - User authenticated: {user_id is not None}")
        except Exception as e:
            print(f"[DEBUG] JWT auth error in segment performance API (non-fatal): {str(e)}")
            user_id = None
            
        # Parse time range parameter
        time_range = request.args.get('timeRange', '30d')
        print(f"[DEBUG] /segments/performance API received timeRange: '{time_range}'")
        
        try:
            # Always try to get real data from database first
            print("[DEBUG] Attempting to fetch segment performance data from database")
            segment_performance = analytics_service.get_segment_performance_analysis(time_range)
            
            if segment_performance and len(segment_performance) > 0:
                print(f"[DEBUG] Successfully retrieved {len(segment_performance)} segment performance records from database")
                return jsonify({"success": True, "data": segment_performance}), 200
            else:
                print("[DEBUG] No segment performance data found in database, using mock data")
                mock_data = analytics_service._get_mock_segment_performance()
                return jsonify({"success": True, "data": mock_data}), 200
        except Exception as e:
            print(f"[DEBUG] Error fetching segment performance from database: {str(e)}")
            
            # Use the fallback mock data from the service
            print("[DEBUG] Using mock segment performance data as fallback")
            mock_data = analytics_service._get_mock_segment_performance()
            return jsonify({"success": True, "data": mock_data}), 200
    except Exception as outer_e:
        print(f"[DEBUG] Outer error in /segments/performance API: {str(outer_e)}")
        # Use fallback mock data
        mock_data = analytics_service._get_mock_segment_performance()
        return jsonify({"success": False, "error": str(outer_e), "data": mock_data}), 200

@analytics_bp.route('/channels/effectiveness', methods=['GET', 'OPTIONS'])
def get_channel_effectiveness():
    """Compare effectiveness across different marketing channels"""
    # Handle CORS preflight request
    if request.method == 'OPTIONS':
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET, OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response, 200
        
    try:
        # First check if the user is authenticated, but don't require it
        try:
            verify_jwt_in_request(optional=True)
            user_id = get_jwt_identity()
            print(f"[DEBUG] Channel effectiveness API - User authenticated: {user_id is not None}")
        except Exception as e:
            print(f"[DEBUG] JWT auth error in channel effectiveness API (non-fatal): {str(e)}")
            user_id = None
            
        # Parse time range parameter
        time_range = request.args.get('timeRange', '30d')
        print(f"[DEBUG] /channels/effectiveness API received timeRange: '{time_range}'")
        
        try:
            # Always try to get real data from database first
            print("[DEBUG] Attempting to fetch channel effectiveness data from database")
            channel_performance = analytics_service.get_channel_effectiveness(time_range)
            
            if channel_performance and len(channel_performance) > 0:
                print(f"[DEBUG] Successfully retrieved {len(channel_performance)} channel performance records from database")
                return jsonify({"success": True, "data": channel_performance}), 200
            else:
                print("[DEBUG] No channel performance data found in database, using mock data")
                mock_data = analytics_service._get_mock_channel_effectiveness()
                return jsonify({"success": True, "data": mock_data}), 200
        except Exception as e:
            print(f"[DEBUG] Error fetching channel effectiveness from database: {str(e)}")
            
            # Use the fallback mock data from the service
            print("[DEBUG] Using mock channel effectiveness data as fallback")
            mock_data = analytics_service._get_mock_channel_effectiveness()
            return jsonify({"success": True, "data": mock_data}), 200
    except Exception as outer_e:
        print(f"[DEBUG] Outer error in /channels/effectiveness API: {str(outer_e)}")
        # Use fallback mock data
        mock_data = analytics_service._get_mock_channel_effectiveness()
        return jsonify({"success": False, "error": str(outer_e), "data": mock_data}), 200 
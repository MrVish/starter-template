from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.analytics_service import AnalyticsService
from datetime import datetime

analytics_bp = Blueprint('analytics', __name__)
analytics_service = AnalyticsService()

@analytics_bp.route('/dashboard-summary', methods=['GET'])
@jwt_required()
def get_dashboard_summary():
    """Get summary statistics for the analytics dashboard"""
    try:
        data = analytics_service.get_dashboard_summary()
        return jsonify({"success": True, "data": data}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@analytics_bp.route('/campaigns/<int:campaign_id>/performance', methods=['GET'])
@jwt_required()
def get_campaign_performance(campaign_id):
    """Get performance metrics for a specific campaign"""
    try:
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
        return jsonify({"success": False, "message": str(e)}), 500

@analytics_bp.route('/segments/performance', methods=['GET'])
@jwt_required()
def get_segment_performance():
    """Compare performance across different customer segments"""
    try:
        data = analytics_service.get_segment_performance_comparison()
        return jsonify({"success": True, "data": data}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@analytics_bp.route('/channels/effectiveness', methods=['GET'])
@jwt_required()
def get_channel_effectiveness():
    """Compare effectiveness across different marketing channels"""
    try:
        data = analytics_service.get_channel_effectiveness()
        return jsonify({"success": True, "data": data}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500 
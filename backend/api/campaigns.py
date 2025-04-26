from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from repositories.campaign_repository import CampaignRepository
from models import DimCampaign

campaigns_bp = Blueprint('campaigns', __name__)
campaign_repository = CampaignRepository()

@campaigns_bp.route('/', methods=['GET'])
@jwt_required()
def get_campaigns():
    """Get all campaigns with performance metrics"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        campaigns = campaign_repository.get_campaigns_with_performance(page=page, per_page=per_page)
        return jsonify({"success": True, "data": campaigns}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@campaigns_bp.route('/<int:campaign_id>', methods=['GET'])
@jwt_required()
def get_campaign(campaign_id):
    """Get a specific campaign by ID"""
    try:
        campaign = campaign_repository.get_by_id(campaign_id)
        if not campaign:
            return jsonify({"success": False, "message": "Campaign not found"}), 404
            
        # Get campaign performance by channel
        channel_performance = campaign_repository.get_campaign_performance_by_channel(campaign_id)
        
        result = campaign.to_dict()
        result['channel_performance'] = channel_performance
        
        return jsonify({"success": True, "data": result}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@campaigns_bp.route('/', methods=['POST'])
@jwt_required()
def create_campaign():
    """Create a new campaign"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Parse date strings to date objects
        if 'start_date' in data and data['start_date']:
            data['start_date'] = datetime.strptime(data['start_date'], '%Y-%m-%d').date()
        if 'end_date' in data and data['end_date']:
            data['end_date'] = datetime.strptime(data['end_date'], '%Y-%m-%d').date()
            
        # Add created_by field
        data['created_by'] = user_id
        
        # Create campaign
        campaign = campaign_repository.create(**data)
        
        return jsonify({
            "success": True, 
            "message": "Campaign created successfully", 
            "data": campaign.to_dict()
        }), 201
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@campaigns_bp.route('/<int:campaign_id>', methods=['PUT'])
@jwt_required()
def update_campaign(campaign_id):
    """Update an existing campaign"""
    try:
        campaign = campaign_repository.get_by_id(campaign_id)
        if not campaign:
            return jsonify({"success": False, "message": "Campaign not found"}), 404
            
        data = request.get_json()
        
        # Parse date strings to date objects
        if 'start_date' in data and data['start_date']:
            data['start_date'] = datetime.strptime(data['start_date'], '%Y-%m-%d').date()
        if 'end_date' in data and data['end_date']:
            data['end_date'] = datetime.strptime(data['end_date'], '%Y-%m-%d').date()
            
        # Update campaign
        updated_campaign = campaign_repository.update(campaign, **data)
        
        return jsonify({
            "success": True, 
            "message": "Campaign updated successfully", 
            "data": updated_campaign.to_dict()
        }), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@campaigns_bp.route('/<int:campaign_id>', methods=['DELETE'])
@jwt_required()
def delete_campaign(campaign_id):
    """Delete a campaign"""
    try:
        success = campaign_repository.delete_by_id(campaign_id)
        if not success:
            return jsonify({"success": False, "message": "Campaign not found"}), 404
            
        return jsonify({
            "success": True, 
            "message": "Campaign deleted successfully"
        }), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500 
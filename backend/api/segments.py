from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import DimSegment, DimCustomer
from repositories.base_repository import BaseRepository

segments_bp = Blueprint('segments', __name__)
segment_repository = BaseRepository(DimSegment)

@segments_bp.route('/', methods=['GET'])
@jwt_required()
def get_segments():
    """Get all customer segments"""
    try:
        segments = segment_repository.get_all()
        
        # Count customers in each segment
        result = []
        for segment in segments:
            segment_dict = segment.to_dict()
            segment_dict['customer_count'] = db.session.query(DimCustomer).filter_by(latest_segment_id=segment.id).count()
            result.append(segment_dict)
        
        return jsonify({"success": True, "data": result}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@segments_bp.route('/<int:segment_id>', methods=['GET'])
@jwt_required()
def get_segment(segment_id):
    """Get a specific segment by ID"""
    try:
        segment = segment_repository.get_by_id(segment_id)
        if not segment:
            return jsonify({"success": False, "message": "Segment not found"}), 404
            
        # Get segment details including customer count
        result = segment.to_dict()
        result['customer_count'] = db.session.query(DimCustomer).filter_by(latest_segment_id=segment.id).count()
        
        # Get a sample of customers in this segment
        customers = db.session.query(DimCustomer).filter_by(latest_segment_id=segment.id).limit(10).all()
        result['sample_customers'] = [customer.to_dict() for customer in customers]
        
        return jsonify({"success": True, "data": result}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@segments_bp.route('/', methods=['POST'])
@jwt_required()
def create_segment():
    """Create a new customer segment"""
    try:
        data = request.get_json()
        
        # Create segment
        segment = segment_repository.create(**data)
        
        return jsonify({
            "success": True, 
            "message": "Segment created successfully", 
            "data": segment.to_dict()
        }), 201
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@segments_bp.route('/<int:segment_id>', methods=['PUT'])
@jwt_required()
def update_segment(segment_id):
    """Update an existing segment"""
    try:
        segment = segment_repository.get_by_id(segment_id)
        if not segment:
            return jsonify({"success": False, "message": "Segment not found"}), 404
            
        data = request.get_json()
        
        # Update segment
        updated_segment = segment_repository.update(segment, **data)
        
        return jsonify({
            "success": True, 
            "message": "Segment updated successfully", 
            "data": updated_segment.to_dict()
        }), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@segments_bp.route('/<int:segment_id>', methods=['DELETE'])
@jwt_required()
def delete_segment(segment_id):
    """Delete a segment"""
    try:
        # Check if segment is being used by any customers
        customers_count = db.session.query(DimCustomer).filter_by(latest_segment_id=segment_id).count()
        if customers_count > 0:
            return jsonify({
                "success": False, 
                "message": f"Cannot delete segment: {customers_count} customers are assigned to this segment"
            }), 400
            
        success = segment_repository.delete_by_id(segment_id)
        if not success:
            return jsonify({"success": False, "message": "Segment not found"}), 404
            
        return jsonify({
            "success": True, 
            "message": "Segment deleted successfully"
        }), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@segments_bp.route('/<int:segment_id>/customers', methods=['GET'])
@jwt_required()
def get_segment_customers(segment_id):
    """Get customers in a specific segment"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        # Check if segment exists
        segment = segment_repository.get_by_id(segment_id)
        if not segment:
            return jsonify({"success": False, "message": "Segment not found"}), 404
            
        # Get paginated customers
        query = db.session.query(DimCustomer).filter_by(latest_segment_id=segment_id)
        total = query.count()
        customers = query.paginate(page=page, per_page=per_page, error_out=False)
        
        result = {
            'segment': segment.to_dict(),
            'customers': [customer.to_dict() for customer in customers.items],
            'total': total,
            'page': page,
            'per_page': per_page,
            'pages': (total // per_page) + (1 if total % per_page > 0 else 0)
        }
        
        return jsonify({"success": True, "data": result}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500 
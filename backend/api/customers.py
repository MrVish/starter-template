from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.customer_service import CustomerService

customers_bp = Blueprint('customers', __name__)
customer_service = CustomerService()

@customers_bp.route('/', methods=['GET'])
@jwt_required()
def get_customers():
    """Get all customers with pagination"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        from repositories.base_repository import BaseRepository
        from models import DimCustomer
        
        repository = BaseRepository(DimCustomer)
        query = DimCustomer.query.order_by(DimCustomer.full_name)
        total = query.count()
        customers = query.paginate(page=page, per_page=per_page, error_out=False)
        
        result = {
            'customers': [customer.to_dict() for customer in customers.items],
            'total': total,
            'page': page,
            'per_page': per_page,
            'pages': (total // per_page) + (1 if total % per_page > 0 else 0)
        }
        
        return jsonify({"success": True, "data": result}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@customers_bp.route('/<int:customer_id>', methods=['GET'])
@jwt_required()
def get_customer(customer_id):
    """Get a specific customer profile with all related data"""
    try:
        customer = customer_service.get_customer_profile(customer_id)
        if not customer:
            return jsonify({"success": False, "message": "Customer not found"}), 404
            
        return jsonify({"success": True, "data": customer}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@customers_bp.route('/<int:customer_id>/transactions', methods=['GET'])
@jwt_required()
def get_customer_transactions(customer_id):
    """Get transaction history for a customer"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        transactions = customer_service.get_customer_transaction_history(
            customer_id=customer_id,
            page=page,
            per_page=per_page
        )
        
        if not transactions:
            return jsonify({"success": False, "message": "Customer not found"}), 404
            
        return jsonify({"success": True, "data": transactions}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@customers_bp.route('/high-value', methods=['GET'])
@jwt_required()
def get_high_value_customers():
    """Get top high-value customers"""
    try:
        limit = request.args.get('limit', 10, type=int)
        customers = customer_service.get_high_value_customers(limit=limit)
        return jsonify({"success": True, "data": customers}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@customers_bp.route('/at-risk', methods=['GET'])
@jwt_required()
def get_customers_at_risk():
    """Get customers with high churn risk"""
    try:
        threshold = request.args.get('threshold', 0.7, type=float)
        limit = request.args.get('limit', 10, type=int)
        
        customers = customer_service.get_customers_at_risk(threshold=threshold, limit=limit)
        return jsonify({"success": True, "data": customers}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@customers_bp.route('/<int:customer_id>/contact-preferences', methods=['PUT'])
@jwt_required()
def update_contact_preferences(customer_id):
    """Update a customer's contact preferences"""
    try:
        data = request.get_json()
        preferences = customer_service.update_customer_contact_preferences(customer_id, data)
        
        if not preferences:
            return jsonify({"success": False, "message": "Customer not found"}), 404
            
        return jsonify({
            "success": True, 
            "message": "Contact preferences updated successfully", 
            "data": preferences
        }), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@customers_bp.route('/<int:customer_id>/feedback', methods=['POST'])
@jwt_required()
def record_feedback(customer_id):
    """Record customer feedback"""
    try:
        data = request.get_json()
        feedback = customer_service.record_customer_feedback(customer_id, data)
        
        if not feedback:
            return jsonify({"success": False, "message": "Customer not found"}), 404
            
        return jsonify({
            "success": True, 
            "message": "Feedback recorded successfully", 
            "data": feedback
        }), 201
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500 
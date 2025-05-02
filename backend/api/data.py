from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from services.data_service import DataService
from extensions import db
from sqlalchemy.exc import SQLAlchemyError

# Create blueprint
data_bp = Blueprint('data', __name__)

# Initialize service
data_service = DataService(db.session)

@data_bp.route('/customers', methods=['GET'])
@jwt_required()
def get_customers():
    """Get a list of customers with optional filtering by segment."""
    try:
        skip = request.args.get('skip', 0, type=int)
        limit = request.args.get('limit', 100, type=int)
        segment_id = request.args.get('segment_id', None, type=int)
        
        result = data_service.get_customers(skip=skip, limit=limit, segment_id=segment_id)
        return jsonify({"success": True, "data": result}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@data_bp.route('/customers/<int:customer_id>', methods=['GET'])
@jwt_required()
def get_customer(customer_id):
    """Get a single customer by ID with their AI features and segment."""
    try:
        result = data_service.get_customer(customer_id)
        if not result:
            return jsonify({"success": False, "message": "Customer not found"}), 404
            
        return jsonify({"success": True, "data": result}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@data_bp.route('/segments', methods=['GET'])
@jwt_required()
def get_segments():
    """Get a list of customer segments."""
    try:
        skip = request.args.get('skip', 0, type=int)
        limit = request.args.get('limit', 100, type=int)
        
        result = data_service.get_segments(skip=skip, limit=limit)
        return jsonify({"success": True, "data": result}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@data_bp.route('/segments/<int:segment_id>', methods=['GET'])
@jwt_required()
def get_segment(segment_id):
    """Get a single segment by ID with performance metrics."""
    try:
        result = data_service.get_segment(segment_id)
        if not result:
            return jsonify({"success": False, "message": "Segment not found"}), 404
            
        return jsonify({"success": True, "data": result}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@data_bp.route('/products', methods=['GET'])
@jwt_required()
def get_products():
    """Get a list of products with optional filtering by type."""
    try:
        skip = request.args.get('skip', 0, type=int)
        limit = request.args.get('limit', 100, type=int)
        product_type = request.args.get('product_type', None)
        
        result = data_service.get_products(skip=skip, limit=limit, product_type=product_type)
        return jsonify({"success": True, "data": result}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@data_bp.route('/products/<int:product_key>', methods=['GET'])
@jwt_required()
def get_product(product_key):
    """Get a single product by ID with transaction metrics."""
    try:
        result = data_service.get_product(product_key)
        if not result:
            return jsonify({"success": False, "message": "Product not found"}), 404
            
        return jsonify({"success": True, "data": result}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@data_bp.route('/transactions', methods=['GET'])
@jwt_required()
def get_transactions():
    """Get a list of transactions with optional filtering."""
    try:
        skip = request.args.get('skip', 0, type=int)
        limit = request.args.get('limit', 100, type=int)
        customer_id = request.args.get('customer_id', None, type=int)
        product_key = request.args.get('product_key', None, type=int)
        txn_type = request.args.get('txn_type', None)
        min_amount = request.args.get('min_amount', None, type=float)
        max_amount = request.args.get('max_amount', None, type=float)
        start_date = request.args.get('start_date', None)
        end_date = request.args.get('end_date', None)
        
        filters = {
            'customer_id': customer_id,
            'product_key': product_key,
            'txn_type': txn_type,
            'min_amount': min_amount,
            'max_amount': max_amount,
            'start_date': start_date,
            'end_date': end_date
        }
        
        result = data_service.get_transactions(skip=skip, limit=limit, filters=filters)
        return jsonify({"success": True, "data": result}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@data_bp.route('/transactions/<int:transaction_key>', methods=['GET'])
@jwt_required()
def get_transaction(transaction_key):
    """Get a single transaction by ID with related data."""
    try:
        result = data_service.get_transaction(transaction_key)
        if not result:
            return jsonify({"success": False, "message": "Transaction not found"}), 404
            
        return jsonify({"success": True, "data": result}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@data_bp.route('/dashboard-summary', methods=['GET'])
@jwt_required()
def get_dashboard_summary():
    """Get a summary of key metrics for the dashboard."""
    try:
        result = data_service.get_dashboard_summary()
        return jsonify({"success": True, "data": result}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500 
"""
API specification for Flask application using Swagger/OpenAPI
"""
import logging
from flask import jsonify, Blueprint, url_for
import os

logger = logging.getLogger(__name__)

def register_apispec(app):
    """Register API documentation endpoints"""
    
    # Create a blueprint for API documentation
    api_docs = Blueprint('api_docs', __name__, url_prefix='/api/docs')
    
    @api_docs.route('/', methods=['GET'])
    def api_docs_index():
        """API documentation index"""
        return jsonify({
            'success': True,
            'message': 'API documentation available',
            'endpoints': get_documentation_endpoints(app),
            'data': {}
        })
    
    @api_docs.route('/routes', methods=['GET'])
    def api_routes():
        """List all API routes"""
        routes = []
        for rule in app.url_map.iter_rules():
            if rule.endpoint != 'static':
                routes.append({
                    'endpoint': rule.endpoint,
                    'methods': list(rule.methods),
                    'path': rule.rule
                })
        
        return jsonify({
            'success': True,
            'message': 'API routes retrieved successfully',
            'data': {
                'routes': routes
            }
        })
    
    # Register the blueprint
    app.register_blueprint(api_docs)
    
    logger.info("API documentation endpoints registered successfully")

def get_documentation_endpoints(app):
    """Get documentation endpoints for the API"""
    return {
        'routes': url_for('api_docs.api_routes', _external=True),
        'swagger': '/api/docs/swagger' if has_swagger(app) else None,
        'redoc': '/api/docs/redoc' if has_swagger(app) else None
    }

def has_swagger(app):
    """Check if Swagger UI is available"""
    swagger_dir = os.path.join(app.static_folder, 'swagger-ui') if app.static_folder else None
    return swagger_dir is not None and os.path.exists(swagger_dir) 
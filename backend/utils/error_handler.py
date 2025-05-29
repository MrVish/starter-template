import traceback
import logging
from flask import jsonify, request, current_app, Response
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from werkzeug.exceptions import HTTPException
from flask_cors import cross_origin

logger = logging.getLogger(__name__)

class APIError(Exception):
    """Base class for API errors"""
    def __init__(self, message, status_code=400, payload=None):
        super().__init__(self)
        self.message = message
        self.status_code = status_code
        self.payload = payload
    
    def to_dict(self):
        rv = dict(self.payload or {})
        rv['error'] = self.message
        rv['status_code'] = self.status_code
        return rv

def handle_api_error(error):
    """Handler for custom API errors"""
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response

def handle_sqlalchemy_error(error):
    """Handler for SQLAlchemy errors"""
    # Log the full error for debugging
    logger.error(f"Database error: {str(error)}\n{traceback.format_exc()}")
    
    # For integrity errors, provide a more user-friendly message
    if isinstance(error, IntegrityError):
        if 'unique constraint' in str(error).lower():
            message = "A record with this information already exists"
        elif 'foreign key constraint' in str(error).lower():
            message = "Referenced record does not exist"
        else:
            message = "Database integrity error"
    else:
        message = "Database error occurred"
    
    response = jsonify({
        'error': message,
        'status_code': 500
    })
    response.status_code = 500
    return response

def handle_http_exception(error):
    """Handler for HTTP exceptions"""
    response = jsonify({
        'error': error.description,
        'status_code': error.code
    })
    response.status_code = error.code
    return response

def handle_generic_exception(error):
    """Handler for all other exceptions"""
    # Log the full error for debugging
    logger.error(f"Unexpected error: {str(error)}\n{traceback.format_exc()}")
    
    # Don't expose internal details in production
    if current_app.config.get('DEBUG', False):
        message = str(error)
        details = traceback.format_exc()
    else:
        message = "An unexpected error occurred"
        details = None
    
    response = jsonify({
        'error': message,
        'details': details,
        'status_code': 500
    })
    response.status_code = 500
    return response

def add_cors_headers(response):
    """Add CORS headers to the response to handle CORS for error responses as well"""
    # Set vary header to tell browsers to cache different responses for different Origin/Auth headers
    response.headers.add('Vary', 'Origin')
    response.headers.add('Vary', 'Access-Control-Request-Method')
    response.headers.add('Vary', 'Access-Control-Request-Headers')
    
    # Add standard CORS headers
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin')
    response.headers.add('Access-Control-Expose-Headers', 'Content-Type, Authorization, X-XSRF-TOKEN')
    response.headers.add('Access-Control-Max-Age', '3600')
    
    # Handle preflight OPTIONS requests specially
    if request.method == 'OPTIONS':
        # For OPTIONS responses, we need to ensure 200 OK status
        response.status_code = 200
    
    return response

def register_error_handlers(app):
    """Register error handlers for Flask application"""
    
    # Handle generic HTTP exceptions
    @app.errorhandler(HTTPException)
    def handle_http_exception(e):
        logger.warning(f"HTTP exception: {e}")
        response = jsonify({
            'success': False,
            'message': str(e.description) if hasattr(e, 'description') else str(e),
            'error': e.__class__.__name__,
            'status_code': e.code if hasattr(e, 'code') else 500,
            'data': {}
        })
        response.status_code = e.code if hasattr(e, 'code') else 500
        return add_cors_headers(response)
    
    # Handle generic exceptions
    @app.errorhandler(Exception)
    def handle_generic_exception(e):
        logger.error(f"Unhandled exception: {type(e).__name__}: {str(e)}")
        response = jsonify({
            'success': False,
            'message': 'An unexpected error occurred',
            'error': type(e).__name__,
            'status_code': 500,
            'data': {}
        })
        response.status_code = 500
        return add_cors_headers(response)
    
    # Handle 404 errors
    @app.errorhandler(404)
    def handle_404_error(e):
        response = jsonify({
            'success': False,
            'message': 'Resource not found',
            'error': 'not_found',
            'status_code': 404,
            'data': {}
        })
        response.status_code = 404
        return add_cors_headers(response)
    
    # Handle 405 errors
    @app.errorhandler(405)
    def handle_405_error(e):
        response = jsonify({
            'success': False,
            'message': 'Method not allowed',
            'error': 'method_not_allowed',
            'status_code': 405,
            'data': {}
        })
        response.status_code = 405
        return add_cors_headers(response)
    
    # Add a special after_request handler for CORS
    @app.after_request
    def cors_after_request(response):
        return add_cors_headers(response)
    
    # Handle OPTIONS requests explicitly for CORS preflight
    @app.route('/', defaults={'path': ''}, methods=['OPTIONS'])
    @app.route('/<path:path>', methods=['OPTIONS'])
    def handle_options(path):
        response = app.make_default_options_response()
        return add_cors_headers(response)
    
    logger.info("Error handlers registered successfully")

def init_app(app):
    """Initialize error handling for the app"""
    register_error_handlers(app) 
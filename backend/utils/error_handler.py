import traceback
import logging
from flask import jsonify, request, current_app
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from werkzeug.exceptions import HTTPException

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

def register_error_handlers(app):
    """Register all error handlers with the Flask app"""
    app.register_error_handler(APIError, handle_api_error)
    app.register_error_handler(SQLAlchemyError, handle_sqlalchemy_error)
    app.register_error_handler(HTTPException, handle_http_exception)
    app.register_error_handler(Exception, handle_generic_exception)

def init_app(app):
    """Initialize error handling for the app"""
    register_error_handlers(app) 
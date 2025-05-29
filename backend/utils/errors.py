"""
Error handlers for Flask application
"""
import logging
from flask import jsonify
import jwt
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError

logger = logging.getLogger(__name__)

def register_error_handlers(app):
    """Register error handlers for Flask application"""
    
    # Handle PyJWT's ExpiredSignatureError
    @app.errorhandler(ExpiredSignatureError)
    def handle_expired_token_error(e):
        logger.warning(f"JWT token expired: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Token has expired',
            'error': 'token_expired',
            'data': {}
        }), 401
    
    # Handle PyJWT's InvalidTokenError
    @app.errorhandler(InvalidTokenError)
    def handle_invalid_token_error(e):
        logger.warning(f"Invalid JWT token: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Invalid token',
            'error': 'invalid_token',
            'data': {}
        }), 401
    
    # General error handler
    @app.errorhandler(Exception)
    def handle_generic_error(e):
        logger.error(f"Unhandled exception: {type(e).__name__}: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'An unexpected error occurred',
            'error': 'server_error',
            'data': {}
        }), 500
    
    # Handle 404 errors
    @app.errorhandler(404)
    def handle_404_error(e):
        return jsonify({
            'success': False,
            'message': 'Resource not found',
            'error': 'not_found',
            'data': {}
        }), 404
    
    # Handle 405 errors
    @app.errorhandler(405)
    def handle_405_error(e):
        return jsonify({
            'success': False,
            'message': 'Method not allowed',
            'error': 'method_not_allowed',
            'data': {}
        }), 405
    
    logger.info("Error handlers registered successfully") 
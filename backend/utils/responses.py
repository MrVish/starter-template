from flask import jsonify

def success_response(data=None, message=None, status_code=200):
    """
    Create a standardized success response
    
    Args:
        data: Data to return to the client
        message: Optional success message
        status_code: HTTP status code (default 200)
        
    Returns:
        A JSON response with standard format
    """
    response = {
        'success': True
    }
    
    if message:
        response['message'] = message
        
    if data is not None:
        response['data'] = data
        
    return jsonify(response), status_code

def error_response(message, status_code=400, errors=None):
    """
    Create a standardized error response
    
    Args:
        message: Error message
        status_code: HTTP status code (default 400)
        errors: Optional dictionary of specific field errors
        
    Returns:
        A JSON response with standard format
    """
    response = {
        'success': False,
        'message': message
    }
    
    if errors:
        response['errors'] = errors
        
    return jsonify(response), status_code 
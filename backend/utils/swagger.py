from flasgger import Swagger, APISpec, Schema, fields
from apispec.ext.marshmallow import MarshmallowPlugin
from apispec_webframeworks.flask import FlaskPlugin

def init_swagger(app):
    """Initialize Swagger documentation for the app"""
    
    # Configure Swagger template
    template = {
        "swagger": "2.0",
        "info": {
            "title": "Modular Framework API",
            "description": "API documentation for the Modular Framework",
            "version": "1.0.0",
            "contact": {
                "name": "API Support",
                "url": "https://example.com/support",
                "email": "support@example.com"
            },
        },
        "securityDefinitions": {
            "Bearer": {
                "type": "apiKey",
                "name": "Authorization",
                "in": "header",
                "description": "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\""
            }
        },
        "security": [
            {
                "Bearer": []
            }
        ],
        "tags": [
            {
                "name": "Authentication",
                "description": "API endpoints for user authentication"
            },
            {
                "name": "Users",
                "description": "API endpoints for user management"
            },
            {
                "name": "Dashboard",
                "description": "API endpoints for dashboard data"
            },
            {
                "name": "Models",
                "description": "API endpoints for machine learning models"
            },
            {
                "name": "System",
                "description": "API endpoints for system management"
            }
        ],
        "definitions": {
            "User": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "integer",
                        "description": "User ID"
                    },
                    "username": {
                        "type": "string",
                        "description": "Username"
                    },
                    "email": {
                        "type": "string",
                        "description": "Email address"
                    },
                    "first_name": {
                        "type": "string",
                        "description": "First name"
                    },
                    "last_name": {
                        "type": "string",
                        "description": "Last name"
                    },
                    "roles": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        },
                        "description": "User roles"
                    }
                }
            },
            "Error": {
                "type": "object",
                "properties": {
                    "error": {
                        "type": "string",
                        "description": "Error message"
                    },
                    "status_code": {
                        "type": "integer",
                        "description": "HTTP status code"
                    }
                }
            }
        }
    }
    
    # Initialize Swagger with the app
    Swagger(app, template=template)
    
    return app 
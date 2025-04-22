from flask import Flask
from flask_cors import CORS
from app.extensions import init_extensions
from app.routes import register_routes

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')
    
    # Initialize extensions
    init_extensions(app)
    
    # Register routes
    register_routes(app)
    
    return app 
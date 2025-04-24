from flask import Flask
from flask_cors import CORS
from extensions import init_extensions

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')
    
    # Initialize extensions
    init_extensions(app)
    
    # Note: Route registration moved to cli_app.py
    # If you need routes, run with: flask --app cli_app run --debug
    
    return app 
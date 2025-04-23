"""
WSGI entry point for the Flask application.
This file should be used for production deployment.
"""
import sys
import os

# Add the current directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import the Flask application from cli_app.py
from cli_app import app

# This will be used by gunicorn or other WSGI servers
if __name__ == '__main__':
    app.run(debug=True) 
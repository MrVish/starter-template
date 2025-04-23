"""
WSGI entry point for the Flask application.
This resolves the import naming conflict between app.py and the app directory.
"""
import sys
import os

# Add the current directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import the Flask application from app.py
from app import app

# This will be used by gunicorn or other WSGI servers
if __name__ == '__main__':
    app.run(debug=True) 
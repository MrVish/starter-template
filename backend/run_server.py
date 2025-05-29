"""
Server runner script with proper Python path setup.
This ensures that all modules can be properly imported.
"""
import os
import sys

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Now import the app from cli_app
from cli_app import app

if __name__ == '__main__':
    print("Starting Flask server...")
    app.run(debug=True, host='0.0.0.0', port=5000) 
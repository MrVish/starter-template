"""
Helper script to run the Flask application with CLI app
"""
import os
import sys

if __name__ == "__main__":
    # Set up CORS environment variables
    os.environ["CORS_ALLOW_ORIGINS"] = "http://localhost:3000"
    os.environ["CORS_ALLOW_CREDENTIALS"] = "true"
    os.environ["CORS_ALLOW_HEADERS"] = "Content-Type,Authorization"
    
    # Run the Flask app with the cli_app as entry point
    os.environ["FLASK_APP"] = "cli_app"
    os.environ["FLASK_DEBUG"] = "1"
    
    # This is equivalent to: flask --app cli_app run --debug
    from flask.cli import main
    sys.argv = ["flask", "run", "--debug"]
    main() 
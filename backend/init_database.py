#!/usr/bin/env python
"""
Initialize the database with the models and default data.

Usage:
    python init_database.py

This script will create the database tables and populate them with default data.
"""

import os
import sys
import logging
from datetime import datetime
from flask_migrate import init as migrate_init, migrate as migrate_migrate, upgrade as migrate_upgrade

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Ensure the script can find the application modules
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

try:
    # Import application and models
    from app import create_app
    from extensions import db
    from utils.init_db import init_db
    
    # Create Flask application for this script
    app = create_app()
    
    # Initialize database
    with app.app_context():
        logger.info("Initializing database...")
        
        # Check if the database already exists
        db_path = os.path.join(current_dir, app.config['SQLALCHEMY_DATABASE_URI'].replace('sqlite:///', ''))
        db_exists = os.path.exists(db_path) if 'sqlite:///' in app.config['SQLALCHEMY_DATABASE_URI'] else True
        
        if not db_exists:
            logger.info("Database file doesn't exist, creating...")
        
        # Initialize migrations if they don't exist
        migrations_dir = os.path.join(current_dir, 'migrations')
        if not os.path.exists(migrations_dir):
            logger.info("Initializing migrations...")
            try:
                migrate_init()
                logger.info("Migrations initialized successfully")
            except Exception as e:
                logger.error(f"Failed to initialize migrations: {e}")
                # Continue anyway since we just want the tables
        
        # Create tables and initialize with default data
        try:
            # Create all tables
            db.create_all()
            logger.info("Database tables created successfully")
            
            # Initialize default data
            init_db()
            logger.info("Database initialized with default data")
            
        except Exception as e:
            logger.error(f"Error during database initialization: {e}")
            sys.exit(1)
    
    logger.info("Database setup completed successfully!")

except Exception as e:
    logger.error(f"Unhandled exception during database setup: {e}")
    sys.exit(1)

# Notify success
print("\nDatabase initialization completed successfully!")
print("You can now start the application with:")
print("    flask --app cli_app run --debug")
print("\nDefault users:")
print("  Admin:     admin@example.com / admin123")
print("  Manager:   manager@example.com / manager123")
print("  Analyst:   analyst@example.com / analyst123")
print("  User:      user@example.com / user123") 
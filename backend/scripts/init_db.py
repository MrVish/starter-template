#!/usr/bin/env python
"""
Initialize the database with tables and default data
"""
import logging
from datetime import datetime, timedelta
from sqlalchemy import inspect
from extensions import db

logger = logging.getLogger(__name__)

def init_db():
    """Initialize the database with tables and default data."""
    logger.info("Initializing database with default data...")
    
    # Create tables if they don't exist
    # This will make sure tables are created with the latest model definitions
    db.create_all()
    
    # Log the tables that were created
    inspector = inspect(db.engine)
    tables = inspector.get_table_names()
    logger.info(f"Database tables: {', '.join(tables)}")
    
    # For each table, log the columns
    for table in tables:
        columns = [column['name'] for column in inspector.get_columns(table)]
        logger.info(f"Table {table} columns: {', '.join(columns)}")
        
    logger.info("Database initialized successfully") 
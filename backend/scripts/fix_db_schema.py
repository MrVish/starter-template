#!/usr/bin/env python
"""
Database Schema Fix Script

This script updates the sql_app.db schema to match the model definitions,
specifically focusing on adding missing columns to the dim_campaigns table.

Usage:
    python backend/scripts/fix_db_schema.py
"""

import os
import sys
import sqlite3
import logging
import inspect
from sqlalchemy import inspect as sa_inspect

# Add parent directory to Python path to import modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("schema_fix")

# Define SQLite database path
DB_PATH = "backend/instance/app.db"

def check_table_exists(table_name):
    """Check if a table exists in the database."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute(f"SELECT name FROM sqlite_master WHERE type='table' AND name='{table_name}';")
    result = cursor.fetchone() is not None
    
    conn.close()
    return result

def get_table_columns(table_name):
    """Get columns for a specific table."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute(f"PRAGMA table_info({table_name});")
    columns = [col[1] for col in cursor.fetchall()]
    
    conn.close()
    return columns

def fix_dim_campaigns_table():
    """Fix the dim_campaigns table by adding missing columns."""
    logger.info("Checking dim_campaigns table...")
    
    # Check if table exists
    if not check_table_exists('dim_campaigns'):
        logger.error("dim_campaigns table does not exist! Run init_database.py first.")
        return False
    
    # Get existing columns
    columns = get_table_columns('dim_campaigns')
    logger.info(f"Current columns in dim_campaigns: {columns}")
    
    # Check for missing columns
    missing_columns = []
    if 'status' not in columns:
        missing_columns.append('status')
    if 'budget' not in columns:
        missing_columns.append('budget')
    
    if not missing_columns:
        logger.info("No missing columns in dim_campaigns table.")
        return True
    
    logger.info(f"Found missing columns: {missing_columns}")
    
    # Add missing columns
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        for column in missing_columns:
            if column == 'status':
                logger.info("Adding 'status' column to dim_campaigns table...")
                cursor.execute("ALTER TABLE dim_campaigns ADD COLUMN status TEXT DEFAULT 'active';")
            elif column == 'budget':
                logger.info("Adding 'budget' column to dim_campaigns table...")
                cursor.execute("ALTER TABLE dim_campaigns ADD COLUMN budget NUMERIC(12,2) DEFAULT 0;")
        
        conn.commit()
        
        # Verify changes
        cursor.execute("PRAGMA table_info(dim_campaigns);")
        updated_columns = [col[1] for col in cursor.fetchall()]
        logger.info(f"Updated columns in dim_campaigns: {updated_columns}")
        
        # Check if all columns were added
        for column in missing_columns:
            if column not in updated_columns:
                logger.error(f"Failed to add column {column} to dim_campaigns table.")
                conn.close()
                return False
        
        conn.close()
        logger.info("Successfully updated dim_campaigns table schema.")
        return True
    except Exception as e:
        logger.error(f"Error fixing dim_campaigns table: {str(e)}")
        return False

def update_campaign_data():
    """Update or insert test campaign data if none exists."""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Check if we have any campaigns
        cursor.execute("SELECT COUNT(*) FROM dim_campaigns;")
        count = cursor.fetchone()[0]
        
        if count == 0:
            logger.info("No campaign data found. Inserting test campaigns...")
            
            # Insert test campaigns with all required fields
            test_campaigns = [
                (1, 'Summer Sale 2023', 'Promotion', 'active', 5000.00, '2023-06-01', '2023-08-31', '2023-05-15'),
                (2, 'Back to School', 'Awareness', 'active', 3500.00, '2023-08-15', '2023-09-15', '2023-07-20'),
                (3, 'Holiday Special', 'Conversion', 'planned', 8000.00, '2023-11-15', '2023-12-31', '2023-10-01'),
                (4, 'Spring Collection', 'Promotion', 'completed', 4200.00, '2023-03-01', '2023-04-30', '2023-02-01'),
                (5, 'Brand Awareness Q2', 'Awareness', 'active', 6000.00, '2023-04-01', '2023-06-30', '2023-03-15')
            ]
            
            # Insert test campaigns
            cursor.executemany(
                """
                INSERT INTO dim_campaigns (id, name, type, status, budget, start_date, end_date, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?);
                """,
                test_campaigns
            )
            
            conn.commit()
            logger.info(f"Inserted {len(test_campaigns)} test campaigns.")
        else:
            logger.info(f"Found {count} existing campaigns. Updating status and budget values...")
            
            # Update existing campaigns to ensure status and budget are populated
            cursor.execute("UPDATE dim_campaigns SET status = 'active' WHERE status IS NULL;")
            cursor.execute("UPDATE dim_campaigns SET budget = 5000.00 WHERE budget IS NULL;")
            
            conn.commit()
            logger.info("Updated existing campaign records with default values.")
        
        conn.close()
        return True
    except Exception as e:
        logger.error(f"Error updating campaign data: {str(e)}")
        return False

def fix_all_tables_with_alembic():
    """Run alembic migration to fix all tables (if alembic is set up)."""
    try:
        logger.info("Checking for alembic migration setup...")
        
        # Check if alembic directory exists
        if not os.path.exists("alembic"):
            logger.warning("Alembic directory not found. Skipping alembic migration.")
            return False
        
        # Check if alembic.ini exists
        if not os.path.exists("alembic.ini"):
            logger.warning("alembic.ini not found. Skipping alembic migration.")
            return False
        
        # Run alembic migration
        logger.info("Running alembic migration...")
        os.system("alembic upgrade head")
        logger.info("Alembic migration completed.")
        return True
    except Exception as e:
        logger.error(f"Error running alembic migration: {str(e)}")
        return False

def main():
    """Main function to fix database schema."""
    logger.info("Starting database schema fix...")
    
    # Make sure we're in the project root directory
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
    os.chdir(project_root)
    
    logger.info(f"Current working directory: {os.getcwd()}")
    
    # Check if database exists
    if not os.path.exists(DB_PATH):
        logger.error(f"Database file {DB_PATH} not found! Run init_database.py first.")
        return
    
    # Fix dim_campaigns table
    if fix_dim_campaigns_table():
        logger.info("Successfully fixed dim_campaigns table schema.")
    else:
        logger.error("Failed to fix dim_campaigns table schema.")
    
    # Update campaign data
    if update_campaign_data():
        logger.info("Successfully updated campaign data.")
    else:
        logger.error("Failed to update campaign data.")
    
    # Try to use alembic if available
    # fix_all_tables_with_alembic()
    
    logger.info("Database schema fix completed!")

if __name__ == "__main__":
    main() 
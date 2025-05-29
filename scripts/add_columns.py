#!/usr/bin/env python
"""
Script to add status and budget columns to dim_campaigns

This script directly adds the missing columns to dim_campaigns
in the instance/app.db database.

Usage:
    python backend/scripts/add_columns.py
"""

import os
import sqlite3
import logging

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("add_columns")

def main():
    """Main function to add columns to dim_campaigns table."""
    # Database path
    db_path = os.path.join("instance", "app.db")
    
    logger.info(f"Checking database: {db_path}")
    
    # Check if database exists
    if not os.path.exists(db_path):
        logger.error(f"Database file {db_path} not found!")
        return False
    
    logger.info(f"Database exists, size: {os.path.getsize(db_path) / 1024:.2f} KB")
    
    try:
        # Connect to the database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check if dim_campaigns table exists
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='dim_campaigns';")
        if not cursor.fetchone():
            logger.error("dim_campaigns table does not exist!")
            conn.close()
            return False
        
        logger.info("dim_campaigns table exists")
        
        # Get existing columns
        cursor.execute("PRAGMA table_info(dim_campaigns);")
        columns = cursor.fetchall()
        column_names = [col[1] for col in columns]
        
        logger.info(f"Existing columns: {column_names}")
        
        # Add status column if it doesn't exist
        if "status" not in column_names:
            logger.info("Adding 'status' column to dim_campaigns...")
            try:
                cursor.execute("ALTER TABLE dim_campaigns ADD COLUMN status TEXT DEFAULT 'active';")
                logger.info("Status column added successfully")
            except sqlite3.OperationalError as e:
                logger.error(f"Error adding status column: {e}")
                # Continue with other operations
        else:
            logger.info("'status' column already exists")
        
        # Add budget column if it doesn't exist
        if "budget" not in column_names:
            logger.info("Adding 'budget' column to dim_campaigns...")
            try:
                cursor.execute("ALTER TABLE dim_campaigns ADD COLUMN budget NUMERIC(12,2) DEFAULT 0;")
                logger.info("Budget column added successfully")
            except sqlite3.OperationalError as e:
                logger.error(f"Error adding budget column: {e}")
                # Continue with other operations
        else:
            logger.info("'budget' column already exists")
        
        # Update existing rows with default values
        cursor.execute("UPDATE dim_campaigns SET status = 'active' WHERE status IS NULL;")
        cursor.execute("UPDATE dim_campaigns SET budget = 5000.00 WHERE budget IS NULL;")
        
        # Commit changes
        conn.commit()
        
        # Verify changes
        cursor.execute("PRAGMA table_info(dim_campaigns);")
        new_columns = cursor.fetchall()
        new_column_names = [col[1] for col in new_columns]
        
        logger.info(f"Updated columns: {new_column_names}")
        
        # Show sample data
        cursor.execute("SELECT id, name, type, status, budget FROM dim_campaigns LIMIT 3;")
        rows = cursor.fetchall()
        
        logger.info("\nSample data:")
        for row in rows:
            logger.info(f"ID: {row[0]}, Name: {row[1]}, Type: {row[2]}, Status: {row[3]}, Budget: {row[4]}")
        
        conn.close()
        logger.info("Column addition completed successfully!")
        return True
        
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        return False

if __name__ == "__main__":
    main() 
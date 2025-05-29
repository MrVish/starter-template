#!/usr/bin/env python
"""
Database Comparison Script

This script checks both sql_app.db and app.db database files,
comparing their tables and especially checking if dim_campaigns exists.

Usage:
    python backend/scripts/check_both_dbs.py
"""

import os
import sys
import sqlite3
import logging

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("db_comparison")

def check_database_exists(db_path):
    """Check if the database file exists."""
    if not os.path.exists(db_path):
        logger.error(f"Database file {db_path} not found!")
        return False
    return True

def list_tables(db_path):
    """List all tables in the database."""
    if not check_database_exists(db_path):
        return []
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = [row[0] for row in cursor.fetchall()]
        
        conn.close()
        return tables
    except Exception as e:
        logger.error(f"Error listing tables in {db_path}: {str(e)}")
        return []

def get_table_schema(db_path, table_name):
    """Get the schema for a table."""
    if not check_database_exists(db_path):
        return None
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        cursor.execute(f"PRAGMA table_info({table_name});")
        columns = cursor.fetchall()
        
        schema = []
        for col in columns:
            schema.append({
                'id': col[0],
                'name': col[1],
                'type': col[2],
                'notnull': col[3],
                'default': col[4],
                'pk': col[5]
            })
        
        conn.close()
        return schema
    except Exception as e:
        logger.error(f"Error getting schema for table {table_name} in {db_path}: {str(e)}")
        return None

def count_rows(db_path, table_name):
    """Count the rows in a table."""
    if not check_database_exists(db_path):
        return -1
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        cursor.execute(f"SELECT COUNT(*) FROM {table_name};")
        count = cursor.fetchone()[0]
        
        conn.close()
        return count
    except Exception as e:
        logger.error(f"Error counting rows in table {table_name} in {db_path}: {str(e)}")
        return -1

def check_table_exists(db_path, table_name):
    """Check if a specific table exists in the database."""
    tables = list_tables(db_path)
    return table_name in tables

def get_database_size(db_path):
    """Get the size of the database file in KB."""
    if not check_database_exists(db_path):
        return 0
    
    try:
        size_bytes = os.path.getsize(db_path)
        size_kb = size_bytes / 1024
        return size_kb
    except Exception as e:
        logger.error(f"Error getting size of {db_path}: {str(e)}")
        return 0

def main():
    """Main function to compare databases."""
    logger.info("Starting database comparison...")
    
    # Make sure we're in the project root directory
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
    os.chdir(project_root)
    
    logger.info(f"Current working directory: {os.getcwd()}")
    
    # Define database paths
    db_paths = [ "backend/instance/app.db"]
    
    # Check the existence and size of each database
    for db_path in db_paths:
        if check_database_exists(db_path):
            size_kb = get_database_size(db_path)
            logger.info(f"Database {db_path} exists (Size: {size_kb:.2f} KB)")
        else:
            logger.info(f"Database {db_path} does not exist")
    
    # Check tables in each database
    for db_path in db_paths:
        if not check_database_exists(db_path):
            continue
        
        logger.info(f"\n{'='*50}")
        logger.info(f"Checking tables in {db_path}")
        logger.info(f"{'='*50}")
        
        tables = list_tables(db_path)
        logger.info(f"Found {len(tables)} tables:")
        for table in sorted(tables):
            row_count = count_rows(db_path, table)
            logger.info(f"  - {table} ({row_count} rows)")
    
    # Specifically check for dim_campaigns table
    dim_campaigns_found = False
    for db_path in db_paths:
        if not check_database_exists(db_path):
            continue
        
        if check_table_exists(db_path, "dim_campaigns"):
            dim_campaigns_found = True
            logger.info(f"\n{'='*50}")
            logger.info(f"Found dim_campaigns table in {db_path}")
            logger.info(f"{'='*50}")
            
            # Get schema for dim_campaigns
            schema = get_table_schema(db_path, "dim_campaigns")
            if schema:
                logger.info("Column Name               | Type      | Not Null | Default   | PK")
                logger.info("-"*80)
                for col in schema:
                    pk_marker = "🔑" if col['pk'] else " "
                    nn_marker = "✓" if col['notnull'] else " "
                    default = str(col['default']) if col['default'] is not None else "NULL"
                    logger.info(f"{col['name']:<25} | {col['type']:<10} | {nn_marker:<8} | {default:<10} | {pk_marker}")
                
                # Check for status and budget columns
                column_names = [col['name'] for col in schema]
                if "status" in column_names:
                    logger.info("✅ 'status' column exists in dim_campaigns table")
                else:
                    logger.warning("❌ 'status' column is MISSING from dim_campaigns table")
                    
                if "budget" in column_names:
                    logger.info("✅ 'budget' column exists in dim_campaigns table")
                else:
                    logger.warning("❌ 'budget' column is MISSING from dim_campaigns table")
            
            # Count rows in dim_campaigns
            row_count = count_rows(db_path, "dim_campaigns")
            logger.info(f"dim_campaigns table has {row_count} rows")
    
    if not dim_campaigns_found:
        logger.error("❌ dim_campaigns table not found in any database!")
        logger.info("""
RECOMMENDATION:
1. Check the database configuration in your app settings
2. Run the init_database.py script with the correct database path
3. Make sure all models are properly imported before db.create_all() is called
4. If using alembic, make sure to generate and run migrations
""")
    
    logger.info("\nDatabase comparison completed!")

if __name__ == "__main__":
    main() 
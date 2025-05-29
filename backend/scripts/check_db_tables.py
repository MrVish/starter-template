#!/usr/bin/env python
"""
Database Tables Check Script

This script checks the tables in the sql_app.db database and displays their structure.

Usage:
    python backend/scripts/check_db_tables.py
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
logger = logging.getLogger("db_check")

DB_PATH = "sql_app.db"

def check_database_exists():
    """Check if the database file exists."""
    if not os.path.exists(DB_PATH):
        logger.error(f"Database file {DB_PATH} not found!")
        return False
    return True

def list_all_sqlite_objects():
    """List all objects in the SQLite database, including tables, indices, triggers, etc."""
    if not check_database_exists():
        return []
    
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        cursor.execute("SELECT type, name FROM sqlite_master ORDER BY type, name;")
        objects = [(row[0], row[1]) for row in cursor.fetchall()]
        
        conn.close()
        return objects
    except Exception as e:
        logger.error(f"Error listing SQLite objects: {str(e)}")
        return []

def list_tables():
    """List all tables in the database."""
    if not check_database_exists():
        return []
    
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = [row[0] for row in cursor.fetchall()]
        
        conn.close()
        return tables
    except Exception as e:
        logger.error(f"Error listing tables: {str(e)}")
        return []

def get_table_schema(table_name):
    """Get the schema for a table."""
    if not check_database_exists():
        return None
    
    try:
        conn = sqlite3.connect(DB_PATH)
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
        logger.error(f"Error getting schema for table {table_name}: {str(e)}")
        return None

def count_rows(table_name):
    """Count the rows in a table."""
    if not check_database_exists():
        return -1
    
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        cursor.execute(f"SELECT COUNT(*) FROM {table_name};")
        count = cursor.fetchone()[0]
        
        conn.close()
        return count
    except Exception as e:
        logger.error(f"Error counting rows in table {table_name}: {str(e)}")
        return -1

def main():
    """Main function to check database tables."""
    logger.info(f"Checking database {DB_PATH}...")
    
    # Make sure we're in the correct directory
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
    os.chdir(project_root)
    
    logger.info(f"Current working directory: {os.getcwd()}")
    
    # List all SQLite objects
    objects = list_all_sqlite_objects()
    if not objects:
        logger.error("No objects found in the database.")
        return
    
    # Group objects by type
    object_types = {}
    for obj_type, obj_name in objects:
        if obj_type not in object_types:
            object_types[obj_type] = []
        object_types[obj_type].append(obj_name)
    
    # Print object counts by type
    logger.info(f"Found {len(objects)} total objects in the database:")
    for obj_type, obj_list in object_types.items():
        logger.info(f"  - {obj_type}: {len(obj_list)} objects")
    
    # List tables
    tables = list_tables()
    if not tables:
        logger.error("No tables found in the database.")
        return
    
    logger.info(f"Found {len(tables)} tables:")
    for table in sorted(tables):
        logger.info(f"  - {table}")
    
    # Get schema and row count for each table
    for table in sorted(tables):
        try:
            row_count = count_rows(table)
            logger.info(f"\n{'='*50}")
            logger.info(f"Table: {table} ({row_count} rows)")
            logger.info(f"{'='*50}")
            
            schema = get_table_schema(table)
            if schema:
                logger.info("Column Name               | Type      | Not Null | Default   | PK")
                logger.info("-"*80)
                for col in schema:
                    pk_marker = "🔑" if col['pk'] else " "
                    nn_marker = "✓" if col['notnull'] else " "
                    default = str(col['default']) if col['default'] is not None else "NULL"
                    logger.info(f"{col['name']:<25} | {col['type']:<10} | {nn_marker:<8} | {default:<10} | {pk_marker}")
        except Exception as e:
            logger.error(f"Error processing table {table}: {str(e)}")
    
    logger.info("\nDatabase check completed!")

if __name__ == "__main__":
    main() 
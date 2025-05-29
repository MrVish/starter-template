#!/usr/bin/env python
"""
Database Check Script for instance/app.db

This script specifically checks the instance/app.db database file
and verifies if dim_campaigns exists with the right schema.

Usage:
    python backend/scripts/check_db_path.py
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

def main():
    """Main function to check the instance/app.db database."""
    logger.info("Checking instance/app.db database...")
    
    # Get the absolute path to the instance folder
    script_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.dirname(script_dir)
    instance_dir = os.path.join(backend_dir, "instance")
    db_path = os.path.join(instance_dir, "app.db")
    
    logger.info(f"Database path: {db_path}")
    
    # Check if database file exists
    if not os.path.exists(db_path):
        logger.error(f"Database file {db_path} not found!")
        return
    
    logger.info(f"Database file exists, size: {os.path.getsize(db_path) / 1024:.2f} KB")
    
    try:
        # Connect to the database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # List all tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        
        logger.info(f"Found {len(tables)} tables:")
        for table in sorted(tables):
            table_name = table[0]
            
            # Count rows in the table
            try:
                cursor.execute(f"SELECT COUNT(*) FROM {table_name};")
                row_count = cursor.fetchone()[0]
                logger.info(f"  - {table_name} ({row_count} rows)")
            except Exception as e:
                logger.error(f"Error counting rows in {table_name}: {str(e)}")
        
        # Check if dim_campaigns exists
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='dim_campaigns';")
        if cursor.fetchone():
            logger.info("\n✅ dim_campaigns table exists")
            
            # Get schema for dim_campaigns
            cursor.execute(f"PRAGMA table_info(dim_campaigns);")
            columns = cursor.fetchall()
            
            logger.info("\nSchema for dim_campaigns:")
            logger.info("Column Name               | Type      | Not Null | Default   | PK")
            logger.info("-"*80)
            
            column_names = []
            for col in columns:
                # col format: (cid, name, type, notnull, dflt_value, pk)
                column_names.append(col[1])
                pk_marker = "🔑" if col[5] else " "
                nn_marker = "✓" if col[3] else " "
                default = str(col[4]) if col[4] is not None else "NULL"
                logger.info(f"{col[1]:<25} | {col[2]:<10} | {nn_marker:<8} | {default:<10} | {pk_marker}")
            
            # Check for status and budget columns
            if "status" in column_names:
                logger.info("✅ 'status' column exists in dim_campaigns table")
            else:
                logger.warning("❌ 'status' column is MISSING from dim_campaigns table")
                
            if "budget" in column_names:
                logger.info("✅ 'budget' column exists in dim_campaigns table")
            else:
                logger.warning("❌ 'budget' column is MISSING from dim_campaigns table")
            
            # Check rows in dim_campaigns
            cursor.execute("SELECT COUNT(*) FROM dim_campaigns;")
            row_count = cursor.fetchone()[0]
            logger.info(f"\ndim_campaigns table has {row_count} rows")
            
            if row_count > 0:
                # Try to get status and budget columns
                status_check = False
                budget_check = False
                
                if "status" in column_names:
                    cursor.execute("SELECT status FROM dim_campaigns LIMIT 1;")
                    status = cursor.fetchone()
                    status_check = True
                    logger.info(f"Sample status value: {status[0]}")
                
                if "budget" in column_names:
                    cursor.execute("SELECT budget FROM dim_campaigns LIMIT 1;")
                    budget = cursor.fetchone()
                    budget_check = True
                    logger.info(f"Sample budget value: {budget[0]}")
                
                # Get sample campaigns
                columns_to_fetch = ["id", "name", "type"]
                if status_check:
                    columns_to_fetch.append("status")
                if budget_check:
                    columns_to_fetch.append("budget")
                
                query = f"SELECT {', '.join(columns_to_fetch)} FROM dim_campaigns LIMIT 5;"
                cursor.execute(query)
                campaigns = cursor.fetchall()
                
                logger.info("\nSample campaigns:")
                headers = [col.upper() for col in columns_to_fetch]
                logger.info(" | ".join(f"{h:<15}" for h in headers))
                logger.info("-"*80)
                
                for campaign in campaigns:
                    logger.info(" | ".join(f"{str(col):<15}" for col in campaign))
        else:
            logger.error("❌ dim_campaigns table does NOT exist in the database!")
        
        conn.close()
        
    except Exception as e:
        logger.error(f"Error checking database: {str(e)}")
    
    logger.info("\nDatabase check completed!")

if __name__ == "__main__":
    main() 
#!/usr/bin/env python
"""
A script to check the database schema and print the existing tables and their structure.

Run from the backend directory with:
python scripts/check_db.py
"""

import os
import sqlite3

# Path to the database
DB_PATH = os.path.join('instance', 'app.db')

def check_database():
    """Check the database schema and print information about it."""
    print(f"Connecting to database at {DB_PATH}...")
    
    if not os.path.exists(DB_PATH):
        print(f"Database file not found at {DB_PATH}")
        return
    
    print(f"Database file exists, size: {os.path.getsize(DB_PATH) / 1024:.2f} KB")
    
    try:
        # Connect to the database
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        # Get list of tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = [row['name'] for row in cursor.fetchall()]
        
        print(f"\nFound {len(tables)} tables:")
        for table in tables:
            print(f"  - {table}")
        
        # For each table, get structure and sample data
        for table in tables:
            print(f"\nStructure of '{table}':")
            cursor.execute(f"PRAGMA table_info({table})")
            columns = cursor.fetchall()
            
            for col in columns:
                print(f"  - {col['name']} ({col['type']})")
            
            # Try to get row count and sample data
            try:
                cursor.execute(f"SELECT COUNT(*) FROM {table}")
                count = cursor.fetchone()[0]
                print(f"\nRow count: {count}")
                
                if count > 0:
                    cursor.execute(f"SELECT * FROM {table} LIMIT 1")
                    sample = cursor.fetchone()
                    print("Sample data:")
                    for col in columns:
                        col_name = col['name']
                        print(f"  - {col_name}: {sample[col_name]}")
            except sqlite3.OperationalError as e:
                print(f"Error getting data: {e}")
        
        # Close the connection
        conn.close()
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_database() 
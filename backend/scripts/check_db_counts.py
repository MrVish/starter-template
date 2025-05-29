#!/usr/bin/env python
"""
A script to check the database tables and count the number of rows in each table.

Run from the backend directory with:
python scripts/check_db_counts.py
"""

import os
import sqlite3

# Path to the database
DB_PATH = os.path.join('instance', 'app.db')

def count_table_rows():
    """Count rows in each table and print the results."""
    print(f"Connecting to database at {DB_PATH}...")
    
    if not os.path.exists(DB_PATH):
        print(f"Database file not found at {DB_PATH}")
        return
    
    print(f"Database file exists, size: {os.path.getsize(DB_PATH) / 1024:.2f} KB")
    
    try:
        # Connect to the database
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Get list of tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = [row[0] for row in cursor.fetchall()]
        
        print(f"\nFound {len(tables)} tables:")
        
        # Count rows in each table
        dim_tables = [t for t in tables if t.startswith('dim_')]
        fact_tables = [t for t in tables if t.startswith('fact_')]
        other_tables = [t for t in tables if not t.startswith('dim_') and not t.startswith('fact_')]
        
        print("\nDimension Tables:")
        for table in sorted(dim_tables):
            try:
                cursor.execute(f"SELECT COUNT(*) FROM {table}")
                count = cursor.fetchone()[0]
                print(f"  - {table}: {count} rows")
            except sqlite3.Error as e:
                print(f"  - {table}: ERROR - {e}")
        
        print("\nFact Tables:")
        for table in sorted(fact_tables):
            try:
                cursor.execute(f"SELECT COUNT(*) FROM {table}")
                count = cursor.fetchone()[0]
                print(f"  - {table}: {count} rows")
            except sqlite3.Error as e:
                print(f"  - {table}: ERROR - {e}")
        
        print("\nOther Tables:")
        for table in sorted(other_tables):
            try:
                cursor.execute(f"SELECT COUNT(*) FROM {table}")
                count = cursor.fetchone()[0]
                print(f"  - {table}: {count} rows")
            except sqlite3.Error as e:
                print(f"  - {table}: ERROR - {e}")
        
        # Close the connection
        conn.close()
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    count_table_rows() 
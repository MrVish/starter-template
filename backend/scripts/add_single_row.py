#!/usr/bin/env python
"""
A very simple script to add a single row to each fact table.
This should help us understand what tables and columns are available.

Run from the backend directory with:
python scripts/add_single_row.py
"""

import os
import sys
import sqlite3
import datetime
import traceback

# Path to the database
DB_PATH = os.path.join('instance', 'app.db')

def show_tables():
    """Show all tables in the database."""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = [row[0] for row in cursor.fetchall()]
        
        print(f"Found {len(tables)} tables:")
        for table in sorted(tables):
            print(f"  - {table}")
        
        # Focus on fact tables
        fact_tables = [t for t in tables if t.startswith('fact_')]
        print(f"\nFound {len(fact_tables)} fact tables:")
        for table in sorted(fact_tables):
            print(f"  - {table}")
            cursor.execute(f"PRAGMA table_info({table})")
            columns = cursor.fetchall()
            for col in columns:
                print(f"      {col[1]} ({col[2]})")
        
        conn.close()
        return fact_tables
    except Exception as e:
        print(f"Error showing tables: {e}")
        traceback.print_exc()
        return []

def add_single_row(table_name):
    """Add a single row to the specified table using a generic approach."""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Get table schema
        cursor.execute(f"PRAGMA table_info({table_name})")
        columns = cursor.fetchall()
        
        # Generate a simple INSERT statement with placeholders
        col_names = [col[1] for col in columns]
        placeholders = ', '.join(['?' for _ in col_names])
        
        # Create default values for each column based on type
        values = []
        for col in columns:
            col_name = col[1]
            col_type = col[2].upper()
            
            # Generate appropriate value based on column type
            if "INTEGER" in col_type or "INT" in col_type:
                values.append(1)
            elif "REAL" in col_type or "FLOAT" in col_type or "DOUBLE" in col_type or "NUMERIC" in col_type:
                values.append(123.45)
            elif "BLOB" in col_type:
                values.append(None)  # Skip BLOB columns
            elif "BOOLEAN" in col_type:
                values.append(1)  # True
            elif "DATE" in col_type or "TIMESTAMP" in col_type or "DATETIME" in col_type:
                values.append(datetime.datetime.now().isoformat())
            else:  # Assume TEXT or VARCHAR
                values.append(f"Test value for {col_name}")
        
        # Create SQL statement
        sql = f"INSERT INTO {table_name} ({', '.join(col_names)}) VALUES ({placeholders})"
        
        # Try to execute
        print(f"\nInserting into {table_name}:")
        print(f"SQL: {sql}")
        print("Values:")
        for i, (col, val) in enumerate(zip(col_names, values)):
            print(f"  {i+1}. {col}: {val}")
        
        cursor.execute(sql, values)
        conn.commit()
        print(f"Successfully inserted a row into {table_name}")
        
        # Check count
        cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
        count = cursor.fetchone()[0]
        print(f"Table {table_name} now has {count} rows")
        
        conn.close()
        return True
    except Exception as e:
        print(f"Error adding row to {table_name}: {e}")
        traceback.print_exc()
        return False

def main():
    """Main function that shows tables and tries to add a single row to each fact table."""
    print(f"Checking database at {DB_PATH}...")
    fact_tables = show_tables()
    
    for table in fact_tables:
        print(f"\n{'='*40}")
        print(f"Trying to add a row to {table}")
        print(f"{'='*40}")
        success = add_single_row(table)
        if success:
            print(f"✅ Added a row to {table}")
        else:
            print(f"❌ Failed to add a row to {table}")

if __name__ == "__main__":
    main() 
#!/usr/bin/env python
"""
Check Campaigns Script

This script checks the dim_campaigns table schema and displays sample data.

Usage:
    python scripts/check_campaigns.py
"""

import os
import sqlite3

# Database path
DB_PATH = "instance/app.db"

def main():
    """Main function to check campaign data."""
    print(f"Checking campaigns in {DB_PATH}...")
    
    if not os.path.exists(DB_PATH):
        print(f"Database file {DB_PATH} not found!")
        return
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Check table schema
    print("\nTable Schema:")
    print("Column | Type | NotNull | Default | PK")
    print("-" * 60)
    
    cursor.execute("PRAGMA table_info(dim_campaigns)")
    columns = cursor.fetchall()
    
    for col in columns:
        # col = (cid, name, type, notnull, dflt_value, pk)
        default_val = col[4] if col[4] is not None else "NULL"
        pk = "YES" if col[5] == 1 else "NO"
        print(f"{col[1]} | {col[2]} | {col[3]} | {default_val} | {pk}")
    
    # Count rows
    cursor.execute("SELECT COUNT(*) FROM dim_campaigns")
    count = cursor.fetchone()[0]
    print(f"\nTotal campaigns: {count}")
    
    # Show sample data
    print("\nSample Campaigns:")
    cursor.execute("""
        SELECT id, name, type, status, budget, start_date, end_date, created_at 
        FROM dim_campaigns 
        LIMIT 5
    """)
    
    rows = cursor.fetchall()
    
    # Get column names for pretty printing
    column_names = [col[1] for col in columns]
    
    # Print header
    print(" | ".join(column_names))
    print("-" * 100)
    
    # Print rows
    for row in rows:
        values = []
        for i, value in enumerate(row):
            if value is None:
                values.append("NULL")
            elif i == 4:  # Budget column
                values.append(f"${value:.2f}")
            else:
                values.append(str(value))
        
        print(" | ".join(values))
    
    conn.close()
    print("\nCheck completed!")

if __name__ == "__main__":
    main() 
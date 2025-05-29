#!/usr/bin/env python
"""
Database Status Check Script

This script checks the status of the database and campaigns.
"""

import os
import sqlite3

# Database path
DB_PATH = "instance/app.db"

def main():
    """Main function."""
    print(f"Checking database at {DB_PATH}...")
    
    if not os.path.exists(DB_PATH):
        print(f"Database file {DB_PATH} not found!")
        return
    
    print(f"Database file exists and is {os.path.getsize(DB_PATH) / 1024:.2f} KB")
    
    # Connect to the database
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Check tables
    print("\nDatabase Tables:")
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    for table in tables:
        print(f"- {table[0]}")
    
    # Check if dim_campaigns exists
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='dim_campaigns';")
    if cursor.fetchone():
        print("\nDim Campaigns table exists")
        
        # Get columns
        print("\nDim Campaigns Columns:")
        cursor.execute("PRAGMA table_info(dim_campaigns);")
        columns = cursor.fetchall()
        for col in columns:
            print(f"- {col[1]} ({col[2]})")
        
        # Count campaigns
        cursor.execute("SELECT COUNT(*) FROM dim_campaigns;")
        count = cursor.fetchone()[0]
        print(f"\nTotal campaigns: {count}")
        
        # Get sample campaigns
        if count > 0:
            print("\nSample campaigns:")
            cursor.execute("SELECT id, name, type, status, budget FROM dim_campaigns LIMIT 5;")
            campaigns = cursor.fetchall()
            for campaign in campaigns:
                print(f"- {campaign[0]}: {campaign[1]}, Type: {campaign[2]}, Status: {campaign[3]}, Budget: {campaign[4]}")
    else:
        print("\nDim Campaigns table does NOT exist!")
    
    # Close connection
    conn.close()

if __name__ == "__main__":
    main() 
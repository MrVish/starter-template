#!/usr/bin/env python
# update_db.py - Add status and budget columns to dim_campaigns

import os
import sqlite3

def main():
    """Add missing columns to dim_campaigns."""
    db_path = os.path.join("instance", "app.db")
    
    if not os.path.exists(db_path):
        print(f"Error: {db_path} not found")
        return
    
    print(f"Updating {db_path}...")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Check if dim_campaigns exists
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='dim_campaigns'")
    if not cursor.fetchone():
        print("Error: dim_campaigns table does not exist")
        conn.close()
        return
    
    # Get current columns
    cursor.execute("PRAGMA table_info(dim_campaigns)")
    cols = cursor.fetchall()
    col_names = [col[1] for col in cols]
    print(f"Current columns: {col_names}")
    
    # Add status if needed
    if "status" not in col_names:
        print("Adding status column...")
        cursor.execute("ALTER TABLE dim_campaigns ADD COLUMN status TEXT DEFAULT 'active'")
        print("Status column added")
    
    # Add budget if needed
    if "budget" not in col_names:
        print("Adding budget column...")
        cursor.execute("ALTER TABLE dim_campaigns ADD COLUMN budget NUMERIC(12,2) DEFAULT 0")
        print("Budget column added")
    
    # Update existing rows
    print("Updating values...")
    cursor.execute("UPDATE dim_campaigns SET status = 'active' WHERE status IS NULL")
    cursor.execute("UPDATE dim_campaigns SET budget = 5000.00 WHERE budget IS NULL")
    
    # Commit and check results
    conn.commit()
    
    # Verify columns
    cursor.execute("PRAGMA table_info(dim_campaigns)")
    new_cols = cursor.fetchall()
    new_col_names = [col[1] for col in new_cols]
    print(f"Updated columns: {new_col_names}")
    
    # Show sample
    cursor.execute("SELECT id, name, type, status, budget FROM dim_campaigns LIMIT 3")
    sample = cursor.fetchall()
    print("\nSample data:")
    for row in sample:
        print(row)
    
    conn.close()
    print("Update complete!")

if __name__ == "__main__":
    main() 
#!/usr/bin/env python
"""Simple Database Schema Check Script"""

import os
import sqlite3

def main():
    """Main function to check the database schema."""
    print("Checking database schema...")
    
    # Specify the path to the database
    db_path = os.path.join("instance", "app.db")
    
    # Check if the database file exists
    if not os.path.exists(db_path):
        print(f"Error: Database file {db_path} not found!")
        return
    
    print(f"Database file exists: {db_path}")
    print(f"File size: {os.path.getsize(db_path) / 1024:.2f} KB")
    
    try:
        # Connect to the database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # List all tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = [row[0] for row in cursor.fetchall()]
        
        print(f"\nFound {len(tables)} tables:")
        for table in sorted(tables):
            print(f"  - {table}")
        
        # Check for dim_campaigns table
        if "dim_campaigns" in tables:
            print("\n✅ dim_campaigns table exists")
            
            # Get schema for dim_campaigns
            cursor.execute("PRAGMA table_info(dim_campaigns);")
            columns = cursor.fetchall()
            
            print("\nSchema for dim_campaigns:")
            print("ID | Name | Type | NotNull | DefaultValue | PrimaryKey")
            print("-" * 70)
            
            column_names = []
            for col in columns:
                column_names.append(col[1])  # Store column names for later checking
                print(f"{col[0]} | {col[1]} | {col[2]} | {col[3]} | {col[4] or 'NULL'} | {col[5]}")
            
            # Check for status and budget columns
            has_status = "status" in column_names
            has_budget = "budget" in column_names
            
            if has_status:
                print("\n✅ 'status' column exists")
            else:
                print("\n❌ 'status' column is MISSING")
                
            if has_budget:
                print("✅ 'budget' column exists")
            else:
                print("❌ 'budget' column is MISSING")
            
            # Generate ALTER TABLE commands if needed
            if not has_status or not has_budget:
                print("\nTo fix the missing columns, run these commands:")
                
                if not has_status:
                    print("ALTER TABLE dim_campaigns ADD COLUMN status TEXT DEFAULT 'active';")
                    
                if not has_budget:
                    print("ALTER TABLE dim_campaigns ADD COLUMN budget NUMERIC(12,2) DEFAULT 0;")
            
            # Count rows in dim_campaigns
            cursor.execute("SELECT COUNT(*) FROM dim_campaigns;")
            row_count = cursor.fetchone()[0]
            print(f"\ndim_campaigns table has {row_count} rows")
            
            # Show sample data if available
            if row_count > 0:
                print("\nSample data (first 3 rows):")
                
                columns_to_select = ["id", "name", "type"]
                if has_status:
                    columns_to_select.append("status")
                if has_budget:
                    columns_to_select.append("budget")
                
                query = f"SELECT {', '.join(columns_to_select)} FROM dim_campaigns LIMIT 3;"
                cursor.execute(query)
                rows = cursor.fetchall()
                
                # Print header
                print(" | ".join(col.upper() for col in columns_to_select))
                print("-" * 80)
                
                # Print rows
                for row in rows:
                    print(" | ".join(str(val) for val in row))
        else:
            print("\n❌ dim_campaigns table does NOT exist")
            print("\nYou need to run init_database.py to create the table.")
        
        conn.close()
        print("\nDatabase check completed!")
        
    except Exception as e:
        print(f"Error checking database: {str(e)}")

if __name__ == "__main__":
    main() 
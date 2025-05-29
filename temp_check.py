import os
import sqlite3

db_path = 'instance/app.db'

# Check if the file exists
if not os.path.exists(db_path):
    print(f"Database file {db_path} not found!")
    exit(1)

print(f"Checking database: {db_path}")
print(f"File size: {os.path.getsize(db_path) / 1024:.2f} KB")

# Connect to the database
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# List tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()
print(f"\nFound {len(tables)} tables:")
for table in sorted(tables):
    print(f"  - {table[0]}")

# Check for dim_campaigns
cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='dim_campaigns';")
if cursor.fetchone():
    print("\ndim_campaigns table exists!")
    
    # Get schema
    cursor.execute("PRAGMA table_info(dim_campaigns);")
    columns = cursor.fetchall()
    
    print("\nColumns in dim_campaigns:")
    print("ID | Name | Type | NotNull | DefaultValue | PK")
    print("-" * 60)
    for col in columns:
        print(f"{col[0]} | {col[1]} | {col[2]} | {col[3]} | {col[4]} | {col[5]}")
    
    # Check for status and budget columns
    column_names = [col[1] for col in columns]
    if "status" in column_names:
        print("\n'status' column exists ✓")
    else:
        print("\n'status' column MISSING ✗")
        
    if "budget" in column_names:
        print("'budget' column exists ✓")
    else:
        print("'budget' column MISSING ✗")
    
    # Count rows
    cursor.execute("SELECT COUNT(*) FROM dim_campaigns;")
    row_count = cursor.fetchone()[0]
    print(f"\ndim_campaigns has {row_count} rows")
    
    # Sample data
    if row_count > 0:
        cursor.execute("SELECT * FROM dim_campaigns LIMIT 3;")
        rows = cursor.fetchall()
        print("\nSample data:")
        for row in rows:
            print(row)
else:
    print("\ndim_campaigns table does NOT exist!")

conn.close() 
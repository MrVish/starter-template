import os
import sqlite3

db_path = "instance/app.db"
print(f"Checking {db_path}")

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

print("\nTables:")
cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = cursor.fetchall()
for table in tables:
    print(f"- {table[0]}")

print("\nChecking for dim_campaigns table:")
cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='dim_campaigns'")
result = cursor.fetchone()
if result:
    print("dim_campaigns table exists")
    
    cursor.execute("PRAGMA table_info(dim_campaigns)")
    columns = cursor.fetchall()
    
    print("\nColumns in dim_campaigns:")
    for col in columns:
        print(f"- {col[1]} ({col[2]})")
    
    # Check for status and budget
    column_names = [col[1] for col in columns]
    if "status" in column_names:
        print("\nstatus column exists")
    else:
        print("\nstatus column is MISSING")
    
    if "budget" in column_names:
        print("budget column exists")
    else:
        print("budget column is MISSING")
    
else:
    print("dim_campaigns table does NOT exist")

conn.close() 
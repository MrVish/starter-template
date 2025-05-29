# Database Schema Update Guide

## Updating the dim_campaigns Table

Based on our analysis, the `instance/app.db` file is the correct database file being used by the application. To make the Recent Campaigns section work correctly, you need to ensure the `dim_campaigns` table has both `status` and `budget` columns.

Follow these steps to update the schema:

1. Navigate to your project directory in a terminal
2. Run Python in interactive mode:
   ```bash
   python
   ```

3. Paste these commands to update the database schema:
   ```python
   import os
   import sqlite3
   
   # Connect to the database
   db_path = "instance/app.db"
   conn = sqlite3.connect(db_path)
   cursor = conn.cursor()
   
   # Check the current schema
   cursor.execute("PRAGMA table_info(dim_campaigns)")
   columns = cursor.fetchall()
   column_names = [col[1] for col in columns]
   print(f"Current columns: {column_names}")
   
   # Add status column if it doesn't exist
   if "status" not in column_names:
       cursor.execute("ALTER TABLE dim_campaigns ADD COLUMN status TEXT DEFAULT 'active'")
       print("Added status column")
   
   # Add budget column if it doesn't exist
   if "budget" not in column_names:
       cursor.execute("ALTER TABLE dim_campaigns ADD COLUMN budget NUMERIC(12,2) DEFAULT 0")
       print("Added budget column")
   
   # Update existing rows with default values
   cursor.execute("UPDATE dim_campaigns SET status = 'active' WHERE status IS NULL")
   cursor.execute("UPDATE dim_campaigns SET budget = 5000.00 WHERE budget IS NULL")
   
   # Commit changes
   conn.commit()
   
   # Verify the changes
   cursor.execute("PRAGMA table_info(dim_campaigns)")
   updated_columns = cursor.fetchall()
   updated_column_names = [col[1] for col in updated_columns]
   print(f"Updated columns: {updated_column_names}")
   
   # Check some data
   cursor.execute("SELECT id, name, type, status, budget FROM dim_campaigns LIMIT 3")
   data = cursor.fetchall()
   print("\nSample data:")
   for row in data:
       print(row)
   
   # Close the connection
   conn.close()
   print("Database updated successfully!")
   ```

4. Exit Python interactive mode by typing `exit()`.

5. Start your application and the Recent Campaigns section should now display correctly.

## If No Campaigns Exist

If your database doesn't have any campaign data, initialize it with:

```python
# Inside Python interactive mode
conn = sqlite3.connect("instance/app.db")
cursor = conn.cursor()

# Insert some sample campaigns
sample_campaigns = [
    (1, 'Summer Sale 2023', 'Promotion', 'active', 5000.00, '2023-06-01', '2023-08-31', '2023-05-15'),
    (2, 'Back to School', 'Awareness', 'active', 3500.00, '2023-08-15', '2023-09-15', '2023-07-20'),
    (3, 'Holiday Special', 'Conversion', 'planned', 8000.00, '2023-11-15', '2023-12-31', '2023-10-01')
]

cursor.executemany("""
    INSERT OR IGNORE INTO dim_campaigns 
    (id, name, type, status, budget, start_date, end_date, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
""", sample_campaigns)

conn.commit()
print("Sample campaigns added")
conn.close()
```

## Additional Notes

- This solution maintains the existing database structure and just adds the required columns
- The database file is located at `instance/app.db`, not the root directory
- The added columns exactly match the model definition in `models/dim_campaigns.py`
- You only need to run this update once - the changes will persist in your database file 
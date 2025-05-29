#!/usr/bin/env python
"""
Add Campaign Data Script

This script adds sample campaign data to the dim_campaigns table in the database.
Ensures data has all required fields including status and budget.

Usage:
    python scripts/add_campaign_data.py
"""

import os
import sqlite3
import random
import datetime
import logging

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("add_campaigns")

# Database path
DB_PATH = "instance/app.db"

def get_random_date(start_year=2023, end_year=2024):
    """Generate a random date in YYYY-MM-DD format."""
    year = random.randint(start_year, end_year)
    month = random.randint(1, 12)
    # Adjust max day based on month
    max_day = 30
    if month in [4, 6, 9, 11]:
        max_day = 30
    elif month == 2:
        max_day = 28
    else:
        max_day = 31
    day = random.randint(1, max_day)
    return f"{year}-{month:02d}-{day:02d}"

def check_table_exists():
    """Check if dim_campaigns table exists."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='dim_campaigns';")
    result = cursor.fetchone() is not None
    
    conn.close()
    return result

def get_table_columns():
    """Get columns for dim_campaigns table."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("PRAGMA table_info(dim_campaigns);")
    columns = [col[1] for col in cursor.fetchall()]
    
    conn.close()
    return columns

def check_table_columns():
    """Check if dim_campaigns table has all required columns."""
    columns = get_table_columns()
    
    required_columns = ["id", "name", "type", "status", "budget", "start_date", "end_date", "created_at"]
    missing_columns = [col for col in required_columns if col not in columns]
    
    return not missing_columns, missing_columns

def add_missing_columns(missing_columns):
    """Add missing columns to dim_campaigns table."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    for column in missing_columns:
        try:
            if column == "created_at":
                logger.info(f"Adding {column} column...")
                cursor.execute(f"ALTER TABLE dim_campaigns ADD COLUMN {column} TEXT DEFAULT '2023-01-01';")
            elif column == "status":
                logger.info(f"Adding {column} column...")
                cursor.execute(f"ALTER TABLE dim_campaigns ADD COLUMN {column} TEXT DEFAULT 'active';")
            elif column == "budget":
                logger.info(f"Adding {column} column...")
                cursor.execute(f"ALTER TABLE dim_campaigns ADD COLUMN {column} NUMERIC(12,2) DEFAULT 0;")
            else:
                logger.info(f"Adding {column} column...")
                cursor.execute(f"ALTER TABLE dim_campaigns ADD COLUMN {column} TEXT;")
        except sqlite3.OperationalError as e:
            logger.error(f"Failed to add column {column}: {str(e)}")
    
    conn.commit()
    conn.close()

def count_existing_campaigns():
    """Count existing campaigns in the table."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) FROM dim_campaigns;")
    count = cursor.fetchone()[0]
    
    conn.close()
    return count

def add_sample_campaigns(num_campaigns=10):
    """Add sample campaign data to dim_campaigns table."""
    # Check if table exists
    if not check_table_exists():
        logger.error("dim_campaigns table does not exist. Please run init_database.py first.")
        return False
    
    # Check if table has required columns and fix if needed
    has_required_columns, missing_columns = check_table_columns()
    if not has_required_columns:
        logger.warning(f"dim_campaigns table is missing columns: {', '.join(missing_columns)}")
        logger.info("Attempting to add missing columns...")
        add_missing_columns(missing_columns)
        
        # Check again after adding columns
        has_required_columns, still_missing = check_table_columns()
        if not has_required_columns:
            logger.error(f"Failed to add columns: {', '.join(still_missing)}")
            return False
        logger.info("Successfully added missing columns")
    
    # Count existing campaigns
    existing_count = count_existing_campaigns()
    logger.info(f"Found {existing_count} existing campaigns")
    
    # Generate sample campaign data
    campaign_types = ["Awareness", "Promotion", "Conversion", "Retention", "Engagement"]
    statuses = ["active", "paused", "planned", "completed", "draft"]
    
    sample_campaigns = []
    for i in range(1, num_campaigns + 1):
        campaign_id = existing_count + i
        campaign_type = random.choice(campaign_types)
        status = random.choice(statuses)
        budget = round(random.uniform(1000, 10000), 2)
        
        # Generate dates
        created_at = get_random_date(2022, 2023)
        start_date = get_random_date(2023, 2023)
        end_date = get_random_date(2023, 2024)
        
        campaign = (
            campaign_id,
            f"Campaign {campaign_id} - {campaign_type}",
            campaign_type,
            status,
            budget,
            start_date,
            end_date,
            created_at
        )
        sample_campaigns.append(campaign)
    
    # Insert campaigns into database
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Create more specific campaign names
        campaign_themes = [
            "Summer Sale", "Back to School", "Holiday Special", "Spring Collection",
            "Black Friday", "New Year Promotion", "Winter Clearance", "Product Launch",
            "Brand Awareness", "Customer Retention", "Re-engagement", "Email Campaign",
            "Social Media Push", "Video Marketing", "Influencer Partnership"
        ]
        
        # Check which columns exist for more robust insertion
        existing_columns = get_table_columns()
        sample_campaigns = []
        
        for i in range(1, num_campaigns + 1):
            campaign_id = existing_count + i
            campaign_type = random.choice(campaign_types)
            status = random.choice(statuses)
            budget = round(random.uniform(1000, 10000), 2)
            theme = random.choice(campaign_themes)
            
            # Generate dates
            created_at = get_random_date(2022, 2023)
            start_date = get_random_date(2023, 2023)
            end_date = get_random_date(2023, 2024)
            
            # Create a descriptive name
            name = f"{theme} {2023 + (i % 2)} - {campaign_type}"
            
            # Create a dynamic dictionary of values based on existing columns
            values = []
            columns_to_insert = []
            
            # Always include these basic fields if they exist
            if "id" in existing_columns:
                values.append(campaign_id)
                columns_to_insert.append("id")
            
            if "name" in existing_columns:
                values.append(name)
                columns_to_insert.append("name")
            
            if "type" in existing_columns:
                values.append(campaign_type)
                columns_to_insert.append("type")
            
            if "status" in existing_columns:
                values.append(status)
                columns_to_insert.append("status")
            
            if "budget" in existing_columns:
                values.append(budget)
                columns_to_insert.append("budget")
            
            if "start_date" in existing_columns:
                values.append(start_date)
                columns_to_insert.append("start_date")
            
            if "end_date" in existing_columns:
                values.append(end_date)
                columns_to_insert.append("end_date")
            
            if "created_at" in existing_columns:
                values.append(created_at)
                columns_to_insert.append("created_at")
            
            sample_campaigns.append(tuple(values))
        
        # Generate placeholders for SQL query
        placeholders = ", ".join(["?"] * len(columns_to_insert))
        columns_str = ", ".join(columns_to_insert)
        
        # Build and execute query
        query = f"INSERT INTO dim_campaigns ({columns_str}) VALUES ({placeholders});"
        cursor.executemany(query, sample_campaigns)
        
        conn.commit()
        
        # Verify insertion
        cursor.execute("SELECT COUNT(*) FROM dim_campaigns;")
        new_count = cursor.fetchone()[0]
        
        conn.close()
        
        added_count = new_count - existing_count
        logger.info(f"Successfully added {added_count} campaigns")
        logger.info(f"Total campaigns in database: {new_count}")
        
        return True
    except Exception as e:
        logger.error(f"Error adding campaigns: {str(e)}")
        return False

def main():
    """Main function."""
    logger.info("Starting to add sample campaign data...")
    
    if not os.path.exists(DB_PATH):
        logger.error(f"Database file {DB_PATH} not found!")
        return
    
    # Add sample campaigns
    add_sample_campaigns(10)
    
    logger.info("Script completed")

if __name__ == "__main__":
    main() 
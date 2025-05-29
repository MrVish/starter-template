#!/usr/bin/env python
"""
A simpler script to populate the database with essential data.
This script uses SQLite3 directly to avoid any potential locking issues.

Run from the backend directory with:
python scripts/populate_simple.py
"""

import os
import sys
import random
import sqlite3
import datetime
from datetime import timedelta
import hashlib
import uuid
import json

# Path to the database
DB_PATH = os.path.join('instance', 'app.db')

# Constants for data generation
NUM_CUSTOMERS = 100
NUM_SEGMENTS = 5
NUM_PRODUCTS = 20
NUM_MERCHANTS = 30
NUM_BRANCHES = 15
NUM_CAMPAIGNS = 10
NUM_TRANSACTIONS = 1000
START_DATE = datetime.datetime(2023, 1, 1)
END_DATE = datetime.datetime.now()

# Helper function to generate hash keys
def generate_hash_key(prefix=''):
    """Generate a 32-character hash key."""
    random_string = prefix + str(uuid.uuid4())
    return hashlib.md5(random_string.encode()).hexdigest()

# Helper function to get random date between START_DATE and END_DATE
def random_date(start=START_DATE, end=END_DATE):
    """Generate a random date between start and end."""
    delta = end - start
    int_delta = (delta.days * 24 * 60 * 60) + delta.seconds
    random_second = random.randrange(int_delta)
    return start + timedelta(seconds=random_second)

def connect_db():
    """Connect to SQLite database."""
    print(f"Connecting to database at {DB_PATH}...")
    conn = sqlite3.connect(DB_PATH)
    # Enable foreign keys
    conn.execute("PRAGMA foreign_keys = ON")
    conn.row_factory = sqlite3.Row
    return conn

def clean_existing_data(conn):
    """Clean existing data from the database."""
    print("Cleaning existing data...")
    # Create a cursor
    cursor = conn.cursor()
    
    # Check which tables exist
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = [row['name'] for row in cursor.fetchall()]
    print(f"Found tables: {tables}")
    
    # Delete data from fact tables first (due to foreign key constraints)
    fact_tables = [t for t in tables if t.startswith('fact_')]
    for table in fact_tables:
        try:
            print(f"Deleting data from {table}")
            cursor.execute(f"DELETE FROM {table}")
        except Exception as e:
            print(f"Error deleting from {table}: {e}")
    
    # Delete data from dimension tables
    dim_tables = [t for t in tables if t.startswith('dim_') and t != 'dim_dates']
    for table in dim_tables:
        try:
            print(f"Deleting data from {table}")
            cursor.execute(f"DELETE FROM {table}")
        except Exception as e:
            print(f"Error deleting from {table}: {e}")
    
    # Commit the transaction
    conn.commit()
    print("Database cleaned.")

def populate_dim_dates(conn):
    """Populate date dimension table."""
    print("Populating dim_dates table...")
    cursor = conn.cursor()
    
    # Check if the table exists
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='dim_dates'")
    if not cursor.fetchone():
        print("Creating dim_dates table...")
        cursor.execute('''
        CREATE TABLE dim_dates (
            id INTEGER PRIMARY KEY,
            full_date DATE NOT NULL,
            day INTEGER NOT NULL,
            month INTEGER NOT NULL,
            year INTEGER NOT NULL,
            quarter INTEGER NOT NULL,
            day_of_week INTEGER NOT NULL,
            day_name TEXT NOT NULL,
            month_name TEXT NOT NULL,
            is_weekend BOOLEAN NOT NULL,
            is_holiday BOOLEAN NOT NULL
        )
        ''')
    
    # Add dates for the last 2 years
    start = datetime.datetime(2022, 1, 1)
    end = datetime.datetime.now()
    current = start
    
    while current <= end:
        # Check if date already exists
        date_key = int(current.strftime('%Y%m%d'))
        cursor.execute("SELECT COUNT(*) FROM dim_dates WHERE id = ?", (date_key,))
        if cursor.fetchone()[0] == 0:
            # Insert the date
            day_of_week = current.weekday()
            day_name = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][day_of_week]
            month_name = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][current.month - 1]
            is_weekend = 1 if day_of_week >= 5 else 0
            is_holiday = 0  # Simplified - not checking for actual holidays
            
            cursor.execute('''
            INSERT INTO dim_dates (id, full_date, day, month, year, quarter, day_of_week, day_name, month_name, is_weekend, is_holiday)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                date_key,
                current.date().isoformat(),
                current.day,
                current.month,
                current.year,
                (current.month - 1) // 3 + 1,
                day_of_week,
                day_name,
                month_name,
                is_weekend,
                is_holiday
            ))
        
        # Move to next day
        current += timedelta(days=1)
    
    # Commit the changes
    conn.commit()
    print("Date dimension populated.")

def populate_dim_segments(conn):
    """Populate segment dimension table."""
    print("Populating dim_segments table...")
    cursor = conn.cursor()
    
    # Check if we have data
    cursor.execute("SELECT COUNT(*) FROM dim_segments")
    if cursor.fetchone()[0] > 0:
        print("Segments already exist. Skipping.")
        return
    
    # Add segment data
    segment_names = [
        "Premium Banking Clients",
        "Digital Banking Power Users",
        "Wealth Management Portfolio",
        "New Client Onboarding",
        "Credit Card Heavy Users"
    ]
    
    for i, name in enumerate(segment_names):
        cursor.execute('''
        INSERT INTO dim_segments (id, name, definition)
        VALUES (?, ?, ?)
        ''', (i+1, name, f"Sample definition for {name}"))
    
    # Commit the changes
    conn.commit()
    print("Segment dimension populated.")

def populate_dim_channels(conn):
    """Populate channel dimension table."""
    print("Populating dim_channels table...")
    cursor = conn.cursor()
    
    # Check if we have data
    cursor.execute("SELECT COUNT(*) FROM dim_channels")
    if cursor.fetchone()[0] > 0:
        print("Channels already exist. Skipping.")
        return
    
    # Add channel data
    channel_data = [
        ("Email Marketing", "EMAIL"),
        ("SMS Alerts", "SMS"),
        ("Mobile App", "APP"),
        ("Online Banking", "WEB"),
        ("Facebook", "SOCIAL"),
        ("Instagram", "SOCIAL"),
        ("Direct Mail", None),
        ("Branch Visits", None)
    ]
    
    for i, (name, channel_type) in enumerate(channel_data):
        cursor.execute('''
        INSERT INTO dim_channels (id, name, type)
        VALUES (?, ?, ?)
        ''', (i+1, name, channel_type))
    
    # Commit the changes
    conn.commit()
    print("Channel dimension populated.")

def populate_dim_campaign_templates(conn):
    """Populate campaign template dimension table."""
    print("Populating dim_campaign_templates table...")
    cursor = conn.cursor()
    
    # Check if we have data
    cursor.execute("SELECT COUNT(*) FROM dim_campaign_templates")
    if cursor.fetchone()[0] > 0:
        print("Campaign templates already exist. Skipping.")
        return
    
    # Add template data
    template_names = [
        "New Product Announcement",
        "Special Offer",
        "Seasonal Promotion",
        "Loyalty Rewards",
        "Account Update"
    ]
    
    for i, name in enumerate(template_names):
        cursor.execute('''
        INSERT INTO dim_campaign_templates (id, title, content)
        VALUES (?, ?, ?)
        ''', (i+1, name, f"Template content for {name}"))
    
    # Commit the changes
    conn.commit()
    print("Campaign template dimension populated.")

def populate_dim_campaigns(conn):
    """Populate campaign dimension table."""
    print("Populating dim_campaigns table...")
    cursor = conn.cursor()
    
    # Check if we have data
    cursor.execute("SELECT COUNT(*) FROM dim_campaigns")
    if cursor.fetchone()[0] > 0:
        print("Campaigns already exist. Skipping.")
        return
    
    # Get segments and templates
    cursor.execute("SELECT id FROM dim_segments")
    segment_ids = [row['id'] for row in cursor.fetchall()]
    
    cursor.execute("SELECT id FROM dim_campaign_templates")
    template_ids = [row['id'] for row in cursor.fetchall()]
    
    if not segment_ids or not template_ids:
        print("Missing segments or templates. Can't create campaigns.")
        return
    
    # Add campaign data
    campaign_types = ["awareness", "retargeting", "conversion", "retention", "loyalty"]
    campaign_statuses = ["active", "paused", "scheduled", "ended"]
    
    for i in range(NUM_CAMPAIGNS):
        start_date = random_date(START_DATE, END_DATE - timedelta(days=30))
        end_date = start_date + timedelta(days=random.randint(7, 60))
        budget = random.uniform(5000, 50000)
        
        cursor.execute('''
        INSERT INTO dim_campaigns (id, name, type, status, budget, start_date, end_date, segment_id, template_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            i+1,
            f"Campaign {i+1}",
            random.choice(campaign_types),
            random.choice(campaign_statuses),
            budget,
            start_date.date().isoformat(),
            end_date.date().isoformat(),
            random.choice(segment_ids),
            random.choice(template_ids)
        ))
    
    # Commit the changes
    conn.commit()
    print("Campaign dimension populated.")

def populate_dim_customers(conn):
    """Populate customer dimension table."""
    print("Populating dim_customers table...")
    cursor = conn.cursor()
    
    # Check if we have data
    cursor.execute("SELECT COUNT(*) FROM dim_customers")
    if cursor.fetchone()[0] > 0:
        print("Customers already exist. Skipping.")
        return
    
    # Get segments
    cursor.execute("SELECT id FROM dim_segments")
    segment_ids = [row['id'] for row in cursor.fetchall()]
    
    if not segment_ids:
        print("Missing segments. Can't create customers.")
        return
    
    # Add customer data
    locations = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", 
                "San Antonio", "San Diego", "Dallas", "San Francisco"]
    income_brackets = ["Low", "Medium", "High", "Very High"]
    risk_profiles = ["Conservative", "Moderate", "Aggressive"]
    
    for i in range(NUM_CUSTOMERS):
        joined_date = random_date(START_DATE - timedelta(days=365*5), END_DATE)
        dob = random_date(datetime.datetime(1960, 1, 1), datetime.datetime(2000, 1, 1))
        
        cursor.execute('''
        INSERT INTO dim_customers (id, full_name, email, dob, gender, income_bracket, risk_profile, location, joined_date, active_product_count, latest_segment_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            i+1,
            f"Customer {i+1}",
            f"customer{i+1}@example.com",
            dob.date().isoformat(),
            random.choice(["Male", "Female", "Other"]),
            random.choice(income_brackets),
            random.choice(risk_profiles),
            random.choice(locations),
            joined_date.date().isoformat(),
            random.randint(1, 5),
            random.choice(segment_ids)
        ))
    
    # Commit the changes
    conn.commit()
    print("Customer dimension populated.")

def populate_dim_customer_ai_features(conn):
    """Populate customer AI features dimension table."""
    print("Populating dim_customer_ai_features table...")
    cursor = conn.cursor()
    
    # Check if we have data
    cursor.execute("SELECT COUNT(*) FROM dim_customer_ai_features")
    if cursor.fetchone()[0] > 0:
        print("Customer AI features already exist. Skipping.")
        return
    
    # Get customer IDs
    cursor.execute("SELECT id FROM dim_customers")
    customer_ids = [row['id'] for row in cursor.fetchall()]
    
    if not customer_ids:
        print("Missing customers. Can't create AI features.")
        return
    
    # Add AI features data
    for customer_id in customer_ids:
        scored_at = datetime.datetime.now() - timedelta(days=random.randint(1, 30))
        
        cursor.execute('''
        INSERT INTO dim_customer_ai_features (customer_id, churn_risk_score, lifetime_value_score, propensity_score, model_version, scored_at)
        VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            customer_id,
            random.uniform(0, 100),
            random.uniform(500, 50000),
            random.uniform(0, 100),
            "v1.0.0",
            scored_at.isoformat()
        ))
    
    # Commit the changes
    conn.commit()
    print("Customer AI features dimension populated.")

def populate_dim_contact_preferences(conn):
    """Populate contact preferences dimension table."""
    print("Populating dim_contact_preferences table...")
    cursor = conn.cursor()
    
    # Check if we have data
    cursor.execute("SELECT COUNT(*) FROM dim_contact_preferences")
    if cursor.fetchone()[0] > 0:
        print("Contact preferences already exist. Skipping.")
        return
    
    # Get customer IDs
    cursor.execute("SELECT id FROM dim_customers")
    customer_ids = [row['id'] for row in cursor.fetchall()]
    
    if not customer_ids:
        print("Missing customers. Can't create contact preferences.")
        return
    
    # Add contact preferences data
    for customer_id in customer_ids:
        cursor.execute('''
        INSERT INTO dim_contact_preferences (customer_id, do_not_email, do_not_sms, preferred_contact_time)
        VALUES (?, ?, ?, ?)
        ''', (
            customer_id,
            1 if random.random() < 0.1 else 0,  # 10% opt out of email
            1 if random.random() < 0.2 else 0,  # 20% opt out of SMS
            random.choice(["morning", "afternoon", "evening"])
        ))
    
    # Commit the changes
    conn.commit()
    print("Contact preferences dimension populated.")

def populate_dim_products(conn):
    """Populate product dimension table."""
    print("Populating dim_products table...")
    cursor = conn.cursor()
    
    # Check if we have data
    cursor.execute("SELECT COUNT(*) FROM dim_products")
    if cursor.fetchone()[0] > 0:
        print("Products already exist. Skipping.")
        return
    
    # Add product data
    product_types = ["CREDIT_CARD", "HOME_LOAN", "PERSONAL_LOAN", "SAVINGS_ACCOUNT", "CHECKING_ACCOUNT"]
    statuses = ["ACTIVE", "DORMANT", "CLOSED"]
    reward_programs = ["Cash Back", "Travel Points", "Shopping Points", None]
    
    for i in range(NUM_PRODUCTS):
        product_type = random.choice(product_types)
        product_hk = generate_hash_key(f"PROD_{i}")
        last_updated = datetime.datetime.now() - timedelta(days=random.randint(0, 90))
        
        # Generate appropriate values based on product type
        if product_type == "CREDIT_CARD":
            credit_limit = random.uniform(500, 50000)
            principal_amt = 0.00
            interest_rate = random.uniform(9.99, 24.99)
            reward_program = random.choice(reward_programs)
            tenure_months = None
            property_type = None
        elif product_type in ["HOME_LOAN", "PERSONAL_LOAN"]:
            credit_limit = None
            principal_amt = random.uniform(10000, 500000)
            interest_rate = random.uniform(2.99, 12.99)
            reward_program = None
            tenure_months = random.randint(12, 360)
            property_type = random.choice(["Single Family", "Condo", "Multi-Family", None])
        else:  # Savings or checking account
            credit_limit = None
            principal_amt = random.uniform(100, 50000)
            interest_rate = random.uniform(0.01, 5.0) if product_type == "SAVINGS_ACCOUNT" else 0.00
            reward_program = None
            tenure_months = None
            property_type = None
        
        cursor.execute('''
        INSERT INTO dim_products (
            product_key, product_hk, account_number, product_type, credit_limit, principal_amt, 
            interest_rate_pct, status, reward_program, tenure_months, property_type, last_updated_dts
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            i+1,
            product_hk,
            f"ACCT-{100000 + i}",
            product_type,
            credit_limit,
            principal_amt,
            interest_rate,
            random.choice(statuses),
            reward_program,
            tenure_months,
            property_type,
            last_updated.isoformat()
        ))
    
    # Commit the changes
    conn.commit()
    print("Product dimension populated.")

def populate_dim_merchants(conn):
    """Populate merchant dimension table."""
    print("Populating dim_merchants table...")
    cursor = conn.cursor()
    
    # Check if we have data
    cursor.execute("SELECT COUNT(*) FROM dim_merchants")
    if cursor.fetchone()[0] > 0:
        print("Merchants already exist. Skipping.")
        return
    
    # Add merchant data
    merchant_categories = [
        "Dining", "Retail", "Travel", "Groceries", "Entertainment", 
        "Utilities", "Healthcare", "Education", "Professional Services"
    ]
    locations = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", 
                "San Antonio", "San Diego", "Dallas", "San Francisco"]
    merchant_countries = ["USA", "Canada", "UK", "France", "Germany", "Japan", "Australia"]
    
    for i in range(NUM_MERCHANTS):
        merchant_name = f"Merchant {i+1}"
        merchant_hk = generate_hash_key(f"MERCH_{merchant_name}")
        last_updated = datetime.datetime.now() - timedelta(days=random.randint(0, 90))
        
        cursor.execute('''
        INSERT INTO dim_merchants (
            id, merchant_hk, merchant_name, merchant_category, merchant_location, merchant_country, last_updated_dts
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            i+1,
            merchant_hk,
            merchant_name,
            random.choice(merchant_categories),
            random.choice(locations),
            random.choice(merchant_countries),
            last_updated.isoformat()
        ))
    
    # Commit the changes
    conn.commit()
    print("Merchant dimension populated.")

def populate_dim_branches(conn):
    """Populate branch dimension table."""
    print("Populating dim_branches table...")
    cursor = conn.cursor()
    
    # Check if we have data
    cursor.execute("SELECT COUNT(*) FROM dim_branches")
    if cursor.fetchone()[0] > 0:
        print("Branches already exist. Skipping.")
        return
    
    # Add branch data
    branch_types = ["FULL_SERVICE", "EXPRESS", "ATM", "DIGITAL"]
    regions = ["East", "West", "North", "South", "Central"]
    channel_categories = ["PHYSICAL", "DIGITAL", "HYBRID"]
    
    for i in range(NUM_BRANCHES):
        branch_code = f"BR-{1000 + i}"
        branch_hk = generate_hash_key(f"BRANCH_{branch_code}")
        last_updated = datetime.datetime.now() - timedelta(days=random.randint(0, 90))
        
        cursor.execute('''
        INSERT INTO dim_branches (
            branch_key, branch_hk, branch_code, branch_name, region, branch_type, 
            channel_category, active_flag, last_updated_dts
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            i+1,
            branch_hk,
            branch_code,
            f"Branch {i+1}",
            random.choice(regions),
            random.choice(branch_types),
            random.choice(channel_categories),
            "Y" if random.random() < 0.9 else "N",  # 90% active
            last_updated.isoformat()
        ))
    
    # Commit the changes
    conn.commit()
    print("Branch dimension populated.")

def populate_dim_data_sources(conn):
    """Populate data source dimension table."""
    print("Populating dim_data_sources table...")
    cursor = conn.cursor()
    
    # Check if we have data
    cursor.execute("SELECT COUNT(*) FROM dim_data_sources")
    if cursor.fetchone()[0] > 0:
        print("Data sources already exist. Skipping.")
        return
    
    # Add data source data
    source_names = ["Core Banking", "CRM", "Digital Banking", "Card Processor", "ETL Pipelines"]
    
    for i, name in enumerate(source_names):
        cursor.execute('''
        INSERT INTO dim_data_sources (id, name)
        VALUES (?, ?)
        ''', (i+1, name))
    
    # Commit the changes
    conn.commit()
    print("Data source dimension populated.")

def populate_fact_transactions(conn):
    """Populate transaction fact table."""
    print("Populating fact_transactions_main table...")
    cursor = conn.cursor()
    
    # Check if we have data
    cursor.execute("SELECT COUNT(*) FROM fact_transactions_main")
    existing_count = cursor.fetchone()[0]
    if existing_count > 0:
        print(f"Already have {existing_count} transactions. Skipping.")
        return
    
    # Get customer, product, branch, and date IDs
    cursor.execute("SELECT id FROM dim_customers")
    customer_ids = [row['id'] for row in cursor.fetchall()]
    
    cursor.execute("SELECT product_key FROM dim_products")
    product_keys = [row['product_key'] for row in cursor.fetchall()]
    
    cursor.execute("SELECT branch_key FROM dim_branches")
    branch_keys = [row['branch_key'] for row in cursor.fetchall()]
    
    cursor.execute("SELECT id FROM dim_dates")
    date_keys = [row['id'] for row in cursor.fetchall()]
    
    cursor.execute("SELECT merchant_category FROM dim_merchants")
    merchant_categories = [row['merchant_category'] for row in cursor.fetchall()]
    
    if not customer_ids or not product_keys or not date_keys:
        print("Missing required dimension data. Can't create transactions.")
        return
    
    # Add transaction data
    transaction_types = ["PURCHASE", "PAYMENT", "WITHDRAWAL", "DEPOSIT", "TRANSFER", "FEE"]
    currencies = ["USD", "EUR", "GBP", "CAD"]
    
    for i in range(NUM_TRANSACTIONS):
        txn_date = random_date(START_DATE, END_DATE)
        date_key = int(txn_date.strftime('%Y%m%d'))
        if date_key not in date_keys:
            continue  # Skip if date not in dimension table
        
        txn_amount = random.uniform(5, 5000)
        txn_type = random.choice(transaction_types)
        customer_id = random.choice(customer_ids)
        product_key = random.choice(product_keys)
        branch_key = random.choice(branch_keys) if random.random() < 0.7 else None  # 70% have branch
        
        # Create transaction hash key
        txn_hk = generate_hash_key(f"TXN_{i}")
        
        cursor.execute('''
        INSERT INTO fact_transactions_main (
            transaction_key, txn_hk, customer_key, product_key, date_key, branch_key, txn_type, txn_amount, 
            txn_currency, merchant_category, txn_timestamp, load_dts
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            i+1,
            txn_hk,
            customer_id,
            product_key,
            date_key,
            branch_key,
            txn_type,
            txn_amount,
            random.choice(currencies),
            random.choice(merchant_categories),
            txn_date.isoformat(),
            datetime.datetime.now().isoformat()
        ))
        
        # Commit every 100 transactions to avoid memory issues
        if i % 100 == 0:
            conn.commit()
            print(f"Inserted {i+1} transactions...")
    
    # Final commit
    conn.commit()
    print("Transaction fact table populated.")

def main():
    """Main function to populate the database."""
    try:
        # Connect to the database
        conn = connect_db()
        
        # Clean existing data if needed
        #clean_existing_data(conn)
        
        # Populate dimension tables
        populate_dim_dates(conn)
        populate_dim_segments(conn)
        populate_dim_channels(conn)
        populate_dim_campaign_templates(conn)
        populate_dim_campaigns(conn)
        populate_dim_customers(conn)
        populate_dim_customer_ai_features(conn)
        populate_dim_contact_preferences(conn)
        populate_dim_products(conn)
        populate_dim_merchants(conn)
        populate_dim_branches(conn)
        populate_dim_data_sources(conn)
        
        # Populate fact tables
        populate_fact_transactions(conn)
        
        # Close the connection
        conn.close()
        print("Database population complete!")
        
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 
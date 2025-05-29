#!/usr/bin/env python
"""
A script to populate fact tables with meaningful data using existing dimension data.

Run from the backend directory with:
python scripts/populate_fact_tables.py
"""

import os
import sys
import random
import sqlite3
import datetime
import traceback
from datetime import timedelta
import hashlib
import uuid
import json

# Path to the database
DB_PATH = os.path.join('instance', 'app.db')

# Constants for data generation
NUM_TRANSACTIONS = 1000
NUM_CREDIT_CARD_TXNS = 500
NUM_REPAYMENTS = 200
NUM_CHANNEL_ACTIVITIES = 300
NUM_CAMPAIGN_PERFORMANCE = 1000
NUM_CHANNEL_PERFORMANCE = 500
NUM_SEGMENT_PERFORMANCE = 200
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
    return conn

def check_table_schema(conn, table_name):
    """Check if a table exists and print its schema."""
    cursor = conn.cursor()
    try:
        cursor.execute(f"PRAGMA table_info({table_name})")
        columns = cursor.fetchall()
        if columns:
            print(f"Schema for {table_name}:")
            for col in columns:
                print(f"  - {col}")
            return True
        else:
            print(f"Table {table_name} doesn't exist or has no columns.")
            return False
    except sqlite3.Error as e:
        print(f"Error checking schema for {table_name}: {e}")
        return False

def populate_fact_transactions(conn):
    """Populate transaction fact table."""
    print("Populating fact_transactions table...")
    cursor = conn.cursor()
    
    # Check if table exists
    if not check_table_schema(conn, "fact_transactions"):
        print("Skipping fact_transactions: Table doesn't exist or has incorrect schema.")
        return
    
    # Get table columns
    cursor.execute("PRAGMA table_info(fact_transactions)")
    columns = [col[1] for col in cursor.fetchall()]
    print(f"Available columns: {columns}")
    
    # Check if we have data
    try:
        cursor.execute("SELECT COUNT(*) FROM fact_transactions")
        existing_count = cursor.fetchone()[0]
        if existing_count > 0:
            print(f"Already have {existing_count} transactions. Skipping.")
            return
    except sqlite3.Error as e:
        print(f"Error counting rows in fact_transactions: {e}")
        return
    
    # Get customer, product, branch, and date IDs
    try:
        cursor.execute("SELECT id FROM dim_customers")
        customer_ids = [row[0] for row in cursor.fetchall()]
        print(f"Found {len(customer_ids)} customers")
        
        cursor.execute("SELECT product_key FROM dim_products")
        product_keys = [row[0] for row in cursor.fetchall()]
        print(f"Found {len(product_keys)} products")
        
        cursor.execute("SELECT branch_key FROM dim_branches")
        branch_keys = [row[0] for row in cursor.fetchall()]
        print(f"Found {len(branch_keys)} branches")
        
        cursor.execute("SELECT id FROM dim_dates")
        date_keys = [row[0] for row in cursor.fetchall()]
        print(f"Found {len(date_keys)} dates")
        
        cursor.execute("SELECT DISTINCT merchant_category FROM dim_merchants")
        merchant_categories = [row[0] for row in cursor.fetchall()]
        print(f"Found {len(merchant_categories)} merchant categories")
    except sqlite3.Error as e:
        print(f"Error fetching dimension data: {e}")
        return
    
    if not customer_ids or not product_keys or not date_keys:
        print("Missing required dimension data. Can't create transactions.")
        return
    
    # Add transaction data
    transaction_types = ["PURCHASE", "PAYMENT", "WITHDRAWAL", "DEPOSIT", "TRANSFER", "FEE"]
    currencies = ["USD", "EUR", "GBP", "CAD"]
    
    try:
        # Try to insert a single test record before bulk insert
        txn_date = random_date(START_DATE, END_DATE)
        date_key = int(txn_date.strftime('%Y%m%d'))
        if date_key not in date_keys:
            date_key = date_keys[0] # Use first available date if random date not found
        
        txn_amount = random.uniform(5, 5000)
        txn_type = random.choice(transaction_types)
        customer_id = random.choice(customer_ids)
        product_key = random.choice(product_keys)
        branch_key = random.choice(branch_keys) if branch_keys else None
        
        # Create transaction hash key
        txn_hk = generate_hash_key(f"TXN_TEST")
        
        test_sql = '''
        INSERT INTO fact_transactions (
            transaction_id, transaction_hash, customer_id, product_id, date_key, branch_id, 
            transaction_type, amount, currency, category, timestamp, created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        '''
        test_values = (
            1,
            txn_hk,
            customer_id,
            product_key,
            date_key,
            branch_key,
            txn_type,
            txn_amount,
            random.choice(currencies),
            random.choice(merchant_categories) if merchant_categories else "Unknown",
            txn_date.isoformat(),
            datetime.datetime.now().isoformat()
        )
        
        print("Trying to insert a test record with values:")
        for i, col in enumerate(["transaction_id", "transaction_hash", "customer_id", "product_id", "date_key", "branch_id", "transaction_type", "amount", "currency", "category", "timestamp", "created_at"]):
            print(f"  - {col}: {test_values[i]}")
            
        cursor.execute(test_sql, test_values)
        conn.commit()
        print("Test insert successful! Proceeding with bulk insert...")
        
    except sqlite3.Error as e:
        print(f"Error inserting test transaction: {e}")
        print("Skipping fact_transactions population due to test failure.")
        return
    
    try:
        for i in range(1, NUM_TRANSACTIONS):  # Start from 1 since we already inserted the first record
            txn_date = random_date(START_DATE, END_DATE)
            date_key = int(txn_date.strftime('%Y%m%d'))
            if date_key not in date_keys:
                date_key = random.choice(date_keys)
            
            txn_amount = random.uniform(5, 5000)
            txn_type = random.choice(transaction_types)
            customer_id = random.choice(customer_ids)
            product_key = random.choice(product_keys)
            branch_key = random.choice(branch_keys) if random.random() < 0.7 and branch_keys else None
            
            # Create transaction hash key
            txn_hk = generate_hash_key(f"TXN_{i}")
            
            cursor.execute('''
            INSERT INTO fact_transactions (
                transaction_id, transaction_hash, customer_id, product_id, date_key, branch_id, 
                transaction_type, amount, currency, category, timestamp, created_at
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
                random.choice(merchant_categories) if merchant_categories else "Unknown",
                txn_date.isoformat(),
                datetime.datetime.now().isoformat()
            ))
            
            # Commit every 100 transactions to avoid memory issues
            if i % 100 == 0:
                conn.commit()
                print(f"Inserted {i+1} transactions...")
        
        # Final commit
        conn.commit()
        print("Transaction fact table populated successfully.")
    except sqlite3.Error as e:
        print(f"Error inserting transactions: {e}")

def populate_fact_spend_cc(conn):
    """Populate credit card spending fact table."""
    print("Populating fact_spend_cc table...")
    cursor = conn.cursor()
    
    # Check if we have data
    cursor.execute("SELECT COUNT(*) FROM fact_spend_cc")
    existing_count = cursor.fetchone()[0]
    if existing_count > 0:
        print(f"Already have {existing_count} credit card transactions. Skipping.")
        return
    
    # Get customers with credit card products
    cursor.execute("SELECT p.product_key, c.id FROM dim_products p JOIN dim_customers c WHERE p.product_type = 'CREDIT_CARD'")
    credit_card_data = cursor.fetchall()
    
    if not credit_card_data:
        # Get all customers and products as fallback
        cursor.execute("SELECT product_key FROM dim_products")
        product_keys = [row[0] for row in cursor.fetchall()]
        
        cursor.execute("SELECT id FROM dim_customers")
        customer_ids = [row[0] for row in cursor.fetchall()]
        
        if not product_keys or not customer_ids:
            print("Missing required dimension data. Can't create CC transactions.")
            return
    
    # Get merchant IDs and date keys
    cursor.execute("SELECT id FROM dim_merchants")
    merchant_ids = [row[0] for row in cursor.fetchall()]
    
    cursor.execute("SELECT id FROM dim_dates")
    date_keys = [row[0] for row in cursor.fetchall()]
    
    if not merchant_ids or not date_keys:
        print("Missing merchants or dates. Can't create CC transactions.")
        return
    
    # Add credit card transaction data
    currencies = ["USD", "EUR", "GBP", "CAD"]
    reward_programs = ["Cash Back", "Travel Points", "Shopping Points", None]
    
    for i in range(NUM_CREDIT_CARD_TXNS):
        txn_date = random_date(START_DATE, END_DATE)
        date_key = int(txn_date.strftime('%Y%m%d'))
        if date_key not in date_keys:
            continue  # Skip if date not in dimension table
        
        # Randomly select product and customer or use fallback
        if credit_card_data:
            product_key, customer_id = random.choice(credit_card_data)
        else:
            product_key = random.choice(product_keys)
            customer_id = random.choice(customer_ids)
        
        merchant_id = random.choice(merchant_ids)
        txn_amount = random.uniform(5, 1000)
        
        # Create transaction hash key
        txn_hk = generate_hash_key(f"CC_TXN_{i}")
        
        cursor.execute('''
        INSERT INTO fact_spend_cc (
            id, transaction_hash, customer_id, product_id, date_key, merchant_id,
            amount, currency, rewards_earned, interest_charged, credit_limit,
            available_credit, reward_program, timestamp, created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            i+1,
            txn_hk,
            customer_id,
            product_key,
            date_key,
            merchant_id,
            txn_amount,
            random.choice(currencies),
            txn_amount * 0.01,  # 1% rewards
            0.00,
            5000.00,  # Default credit limit
            5000.00 - txn_amount,  # Available credit
            random.choice(reward_programs),
            txn_date.isoformat(),
            datetime.datetime.now().isoformat()
        ))
        
        # Commit every 100 transactions to avoid memory issues
        if i % 100 == 0:
            conn.commit()
            print(f"Inserted {i+1} credit card transactions...")
    
    # Final commit
    conn.commit()
    print("Credit card spending fact table populated.")

def populate_fact_repayments(conn):
    """Populate loan repayments fact table."""
    print("Populating fact_repayments table...")
    cursor = conn.cursor()
    
    # Check if we have data
    cursor.execute("SELECT COUNT(*) FROM fact_repayments")
    existing_count = cursor.fetchone()[0]
    if existing_count > 0:
        print(f"Already have {existing_count} repayments. Skipping.")
        return
    
    # Get customers with loan products
    cursor.execute("SELECT p.product_key, c.id, p.principal_amt FROM dim_products p JOIN dim_customers c WHERE p.product_type IN ('HOME_LOAN', 'PERSONAL_LOAN')")
    loan_data = cursor.fetchall()
    
    if not loan_data:
        # Get all customers and products as fallback
        cursor.execute("SELECT product_key FROM dim_products")
        product_keys = [row[0] for row in cursor.fetchall()]
        
        cursor.execute("SELECT id FROM dim_customers")
        customer_ids = [row[0] for row in cursor.fetchall()]
        
        if not product_keys or not customer_ids:
            print("Missing required dimension data. Can't create repayments.")
            return
    
    # Get date keys
    cursor.execute("SELECT id FROM dim_dates")
    date_keys = [row[0] for row in cursor.fetchall()]
    
    if not date_keys:
        print("Missing dates. Can't create repayments.")
        return
    
    # Add repayment data
    payment_methods = ["ACH", "CHECK", "ONLINE_BANKING", "AUTOMATIC_DEBIT"]
    payment_statuses = ["COMPLETED", "PENDING", "FAILED", "OVERDUE"]
    
    for i in range(NUM_REPAYMENTS):
        repayment_date = random_date(START_DATE, END_DATE)
        date_key = int(repayment_date.strftime('%Y%m%d'))
        if date_key not in date_keys:
            continue  # Skip if date not in dimension table
        
        # Randomly select product, customer and principal or use fallback
        if loan_data:
            product_key, customer_id, principal_amt = random.choice(loan_data)
            if principal_amt is None:
                principal_amt = random.uniform(10000, 500000)
        else:
            product_key = random.choice(product_keys)
            customer_id = random.choice(customer_ids)
            principal_amt = random.uniform(10000, 500000)
        
        # Create repayment hash key
        repayment_id = f"REPAY-{1000 + i}"
        
        # Generate repayment amount and components
        principal = random.uniform(100, 2000)
        interest = random.uniform(50, 500)
        fee = random.uniform(0, 50)
        total_amount = principal + interest + fee
        
        cursor.execute('''
        INSERT INTO fact_repayments (
            id, repayment_id, customer_id, product_id, date_key, amount,
            principal_amount, interest_amount, fee_amount, remaining_principal,
            payment_method, status, days_past_due, timestamp, due_date, created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            i+1,
            repayment_id,
            customer_id,
            product_key,
            date_key,
            total_amount,
            principal,
            interest,
            fee,
            principal_amt - principal,
            random.choice(payment_methods),
            random.choice(payment_statuses),
            random.randint(0, 60) if random.random() < 0.1 else 0,  # 10% with past due days
            repayment_date.isoformat(),
            (repayment_date - timedelta(days=random.randint(0, 30))).isoformat(),
            datetime.datetime.now().isoformat()
        ))
        
        # Commit every 50 repayments to avoid memory issues
        if i % 50 == 0:
            conn.commit()
            print(f"Inserted {i+1} repayments...")
    
    # Final commit
    conn.commit()
    print("Repayments fact table populated.")

def populate_fact_customer_channel_activity(conn):
    """Populate customer channel activity fact table."""
    print("Populating fact_customer_channel_activity table...")
    cursor = conn.cursor()
    
    # Check if we have data
    cursor.execute("SELECT COUNT(*) FROM fact_customer_channel_activity")
    existing_count = cursor.fetchone()[0]
    if existing_count > 0:
        print(f"Already have {existing_count} channel activities. Skipping.")
        return
    
    # Get customers, channels and date keys
    cursor.execute("SELECT id FROM dim_customers")
    customer_ids = [row[0] for row in cursor.fetchall()]
    
    cursor.execute("SELECT id, type FROM dim_channels")
    channel_data = cursor.fetchall()
    
    cursor.execute("SELECT id FROM dim_dates")
    date_keys = [row[0] for row in cursor.fetchall()]
    
    if not customer_ids or not channel_data or not date_keys:
        print("Missing required dimension data. Can't create channel activities.")
        return
    
    # Add channel activity data
    for i in range(NUM_CHANNEL_ACTIVITIES):
        activity_date = random_date(START_DATE, END_DATE)
        date_key = int(activity_date.strftime('%Y%m%d'))
        if date_key not in date_keys:
            continue  # Skip if date not in dimension table
        
        customer_id = random.choice(customer_ids)
        channel_id, channel_type = random.choice(channel_data)
        
        # Generate activity metrics based on channel type
        opens = random.randint(0, 10) if channel_type in ['EMAIL', 'SMS'] else 0
        clicks = random.randint(0, opens) if opens > 0 else 0
        logins = random.randint(0, 5) if channel_type in ['APP', 'WEB'] else 0
        session_count = random.randint(1, 10) if logins > 0 else 0
        session_duration = random.randint(60, 1800) if session_count > 0 else None  # 1-30 minutes
        
        cursor.execute('''
        INSERT INTO fact_customer_channel_activity (
            id, customer_id, date_key, channel_id, opens, clicks, logins,
            session_count, session_duration, conversions, bounces, activity_date, created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            i+1,
            customer_id,
            date_key,
            channel_id,
            opens,
            clicks,
            logins,
            session_count,
            session_duration,
            random.randint(0, 2),  # conversions
            random.randint(0, 5),  # bounces
            activity_date.isoformat(),
            datetime.datetime.now().isoformat()
        ))
        
        # Commit every 50 activities to avoid memory issues
        if i % 50 == 0:
            conn.commit()
            print(f"Inserted {i+1} channel activities...")
    
    # Final commit
    conn.commit()
    print("Customer channel activity fact table populated.")

def populate_fact_campaign_performance(conn):
    """Populate campaign performance fact table."""
    print("Populating fact_campaign_performance table...")
    cursor = conn.cursor()
    
    # Check if we have data
    cursor.execute("SELECT COUNT(*) FROM fact_campaign_performance")
    existing_count = cursor.fetchone()[0]
    if existing_count > 0:
        print(f"Already have {existing_count} campaign performance records. Skipping.")
        return
    
    # Get campaigns, channels, segments and date keys
    cursor.execute("SELECT id, segment_id, start_date, end_date FROM dim_campaigns")
    campaign_data = cursor.fetchall()
    
    cursor.execute("SELECT id FROM dim_channels")
    channel_ids = [row[0] for row in cursor.fetchall()]
    
    cursor.execute("SELECT id FROM dim_segments")
    segment_ids = [row[0] for row in cursor.fetchall()]
    
    cursor.execute("SELECT id FROM dim_dates")
    date_keys = [row[0] for row in cursor.fetchall()]
    
    if not campaign_data or not channel_ids or not date_keys:
        print("Missing required dimension data. Can't create campaign performance records.")
        return
    
    # Add campaign performance data
    performance_id = 1
    
    for campaign_id, segment_id, start_date, end_date in campaign_data:
        if not start_date or not end_date:
            continue
            
        # Parse dates
        try:
            start = datetime.datetime.fromisoformat(start_date)
            end = datetime.datetime.fromisoformat(end_date)
        except ValueError:
            continue
            
        # Create performance records for each day between start and end date
        current_date = start
        while current_date <= end:
            date_key = int(current_date.strftime('%Y%m%d'))
            if date_key not in date_keys:
                current_date += timedelta(days=1)
                continue
                
            # Create performance for different channels
            for channel_id in random.sample(channel_ids, k=min(3, len(channel_ids))):
                # Generate metrics
                impressions = random.randint(100, 10000)
                clicks = random.randint(0, min(impressions, 1000))
                conversions = random.randint(0, min(clicks, 100))
                spend = random.uniform(50, 5000)
                
                cursor.execute('''
                INSERT INTO fact_campaign_performance (
                    id, campaign_id, channel_id, segment_id, date_key,
                    impressions, clicks, conversions, spend
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    performance_id,
                    campaign_id,
                    channel_id,
                    segment_id or random.choice(segment_ids),  # Use campaign segment or random if None
                    date_key,
                    impressions,
                    clicks,
                    conversions,
                    spend
                ))
                
                performance_id += 1
            
            # Move to next day
            current_date += timedelta(days=1)
            
            # Commit every 100 records to avoid memory issues
            if performance_id % 100 == 0:
                conn.commit()
                print(f"Inserted {performance_id} campaign performance records...")
    
    # Final commit
    conn.commit()
    print(f"Campaign performance fact table populated with {performance_id-1} records.")

def populate_fact_channel_performance(conn):
    """Populate channel performance fact table."""
    print("Populating fact_channel_performance table...")
    cursor = conn.cursor()
    
    # Check if we have data
    cursor.execute("SELECT COUNT(*) FROM fact_channel_performance")
    existing_count = cursor.fetchone()[0]
    if existing_count > 0:
        print(f"Already have {existing_count} channel performance records. Skipping.")
        return
    
    # Get channels and date keys
    cursor.execute("SELECT id FROM dim_channels")
    channel_ids = [row[0] for row in cursor.fetchall()]
    
    cursor.execute("SELECT id FROM dim_dates")
    date_keys = [row[0] for row in cursor.fetchall()]
    
    if not channel_ids or not date_keys:
        print("Missing required dimension data. Can't create channel performance records.")
        return
    
    # Add channel performance data
    # Create 6 months of channel performance data
    performance_id = 1
    start_date = datetime.datetime.now() - timedelta(days=180)
    end_date = datetime.datetime.now()
    current_date = start_date
    
    while current_date <= end_date:
        date_key = int(current_date.strftime('%Y%m%d'))
        if date_key not in date_keys:
            current_date += timedelta(days=1)
            continue
            
        # Create performance for each channel
        for channel_id in channel_ids:
            # Generate metrics
            impressions = random.randint(1000, 50000)
            clicks = random.randint(0, min(impressions, 5000))
            
            cursor.execute('''
            INSERT INTO fact_channel_performance (
                id, channel_id, date_key, impressions, clicks
            )
            VALUES (?, ?, ?, ?, ?)
            ''', (
                performance_id,
                channel_id,
                date_key,
                impressions,
                clicks
            ))
            
            performance_id += 1
        
        # Move to next day
        current_date += timedelta(days=1)
        
        # Commit every 100 records to avoid memory issues
        if performance_id % 100 == 0:
            conn.commit()
            print(f"Inserted {performance_id} channel performance records...")
    
    # Final commit
    conn.commit()
    print(f"Channel performance fact table populated with {performance_id-1} records.")

def populate_fact_segment_performance(conn):
    """Populate segment performance fact table."""
    print("Populating fact_segment_performance table...")
    cursor = conn.cursor()
    
    # Check if we have data
    cursor.execute("SELECT COUNT(*) FROM fact_segment_performance")
    existing_count = cursor.fetchone()[0]
    if existing_count > 0:
        print(f"Already have {existing_count} segment performance records. Skipping.")
        return
    
    # Get segments and date keys
    cursor.execute("SELECT id FROM dim_segments")
    segment_ids = [row[0] for row in cursor.fetchall()]
    
    cursor.execute("SELECT id FROM dim_dates")
    date_keys = [row[0] for row in cursor.fetchall()]
    
    if not segment_ids or not date_keys:
        print("Missing required dimension data. Can't create segment performance records.")
        return
    
    # Add segment performance data
    # Create 6 months of segment performance data
    performance_id = 1
    start_date = datetime.datetime.now() - timedelta(days=180)
    end_date = datetime.datetime.now()
    current_date = start_date
    
    while current_date <= end_date:
        # Use weekly data for segments
        date_key = int(current_date.strftime('%Y%m%d'))
        if date_key not in date_keys:
            current_date += timedelta(days=7)
            continue
            
        # Create performance for each segment
        for segment_id in segment_ids:
            # Generate metrics - engagement score 0-100
            engagement_score = random.uniform(0, 100)
            
            cursor.execute('''
            INSERT INTO fact_segment_performance (
                id, segment_id, date_key, engagement_score
            )
            VALUES (?, ?, ?, ?)
            ''', (
                performance_id,
                segment_id,
                date_key,
                engagement_score
            ))
            
            performance_id += 1
        
        # Move to next week (use weekly data for segments)
        current_date += timedelta(days=7)
        
        # Commit every 100 records to avoid memory issues
        if performance_id % 100 == 0:
            conn.commit()
            print(f"Inserted {performance_id} segment performance records...")
    
    # Final commit
    conn.commit()
    print(f"Segment performance fact table populated with {performance_id-1} records.")

def main():
    """Main function to populate the fact tables."""
    try:
        # Connect to the database
        conn = connect_db()
        
        # Check what tables exist
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'fact_%'")
        fact_tables = [row[0] for row in cursor.fetchall()]
        print(f"Found fact tables: {fact_tables}")
        
        # Populate fact tables
        populate_fact_transactions(conn)
        populate_fact_spend_cc(conn)
        populate_fact_repayments(conn)
        populate_fact_customer_channel_activity(conn)
        populate_fact_campaign_performance(conn)
        populate_fact_channel_performance(conn)
        populate_fact_segment_performance(conn)
        
        # Close the connection
        conn.close()
        print("Fact tables population complete!")
        
    except Exception as e:
        print(f"Error: {e}")
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main() 
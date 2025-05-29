#!/usr/bin/env python
"""
A script to populate the fact tables with meaningful data based on existing dimension tables.
This FORCE version will add more data even if the tables already have rows.

Run from the backend directory with:
python scripts/populate_meaningful_data_force.py
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

# Path to the database
DB_PATH = os.path.join('instance', 'app.db')

# Constants for data generation
NUM_TRANSACTIONS = 500
NUM_CREDIT_CARD_TXNS = 200
NUM_REPAYMENTS = 100
NUM_CHANNEL_ACTIVITIES = 300
NUM_CAMPAIGN_PERFORMANCE = 200
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

def get_dimension_data(conn):
    """Get all necessary dimension data for fact tables."""
    cursor = conn.cursor()
    data = {}
    
    # Get customers
    cursor.execute("SELECT id FROM dim_customers")
    data['customer_ids'] = [row[0] for row in cursor.fetchall()]
    print(f"Found {len(data['customer_ids'])} customers")
    
    # Get products
    cursor.execute("SELECT product_key, product_type FROM dim_products")
    products = cursor.fetchall()
    data['product_keys'] = [row[0] for row in products]
    data['credit_card_keys'] = [row[0] for row in products if row[1] == 'CREDIT_CARD']
    data['loan_keys'] = [row[0] for row in products if row[1] in ('HOME_LOAN', 'PERSONAL_LOAN')]
    print(f"Found {len(data['product_keys'])} products ({len(data['credit_card_keys'])} credit cards, {len(data['loan_keys'])} loans)")
    
    # Get dates
    cursor.execute("SELECT id FROM dim_dates")
    data['date_keys'] = [row[0] for row in cursor.fetchall()]
    print(f"Found {len(data['date_keys'])} dates")
    
    # Get branches
    cursor.execute("SELECT branch_key FROM dim_branches")
    data['branch_keys'] = [row[0] for row in cursor.fetchall()]
    print(f"Found {len(data['branch_keys'])} branches")
    
    # Get merchants
    cursor.execute("SELECT id, merchant_category FROM dim_merchants")
    merchants = cursor.fetchall()
    data['merchant_ids'] = [row[0] for row in merchants]
    data['merchant_categories'] = list(set([row[1] for row in merchants]))
    print(f"Found {len(data['merchant_ids'])} merchants with {len(data['merchant_categories'])} categories")
    
    # Get channels
    cursor.execute("SELECT id, type FROM dim_channels")
    data['channel_ids'] = [row[0] for row in cursor.fetchall()]
    print(f"Found {len(data['channel_ids'])} channels")
    
    # Get campaigns
    cursor.execute("SELECT id, segment_id FROM dim_campaigns")
    campaigns = cursor.fetchall()
    data['campaign_ids'] = [row[0] for row in campaigns]
    print(f"Found {len(data['campaign_ids'])} campaigns")
    
    # Get segments
    cursor.execute("SELECT id FROM dim_segments")
    data['segment_ids'] = [row[0] for row in cursor.fetchall()]
    print(f"Found {len(data['segment_ids'])} segments")
    
    return data

def get_max_id(conn, table, id_column):
    """Get the maximum ID value from a table."""
    cursor = conn.cursor()
    try:
        cursor.execute(f"SELECT MAX({id_column}) FROM {table}")
        max_id = cursor.fetchone()[0]
        return max_id if max_id is not None else 0
    except sqlite3.Error:
        return 0

def populate_fact_transactions(conn, dim_data):
    """Populate fact_transactions and fact_transactions_datavault tables."""
    print("\nPopulating fact_transactions and fact_transactions_datavault tables...")
    cursor = conn.cursor()
    
    # Get current max IDs
    max_transaction_id = get_max_id(conn, "fact_transactions", "id")
    max_dv_transaction_id = get_max_id(conn, "fact_transactions_datavault", "transaction_key")
    
    print(f"Current max transaction ID: {max_transaction_id}")
    print(f"Current max datavault transaction ID: {max_dv_transaction_id}")
    
    # Generate transaction data
    transaction_types = ["PURCHASE", "PAYMENT", "WITHDRAWAL", "DEPOSIT", "TRANSFER", "FEE"]
    currencies = ["USD", "EUR", "GBP", "CAD"]
    
    # For fact_transactions
    for i in range(NUM_TRANSACTIONS):
        try:
            txn_date = random_date()
            date_key = int(txn_date.strftime('%Y%m%d'))
            
            # Skip if date_key not in our dimension table
            if date_key not in dim_data['date_keys']:
                continue
            
            customer_id = random.choice(dim_data['customer_ids'])
            product_key = random.choice(dim_data['product_keys'])
            txn_amount = random.uniform(5, 5000)
            txn_type = random.choice(transaction_types)
            
            # Optional campaign and channel association (30% chance)
            campaign_id = random.choice(dim_data['campaign_ids']) if random.random() < 0.3 and dim_data['campaign_ids'] else None
            channel_id = random.choice(dim_data['channel_ids']) if random.random() < 0.3 and dim_data['channel_ids'] else None
            
            # For fact_transactions
            cursor.execute('''
            INSERT INTO fact_transactions (
                id, customer_id, txn_date, product_code, product_key, txn_amount, 
                txn_type, campaign_id, channel_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                max_transaction_id + i + 1,
                customer_id,
                txn_date.date().isoformat(),
                f"PROD-{product_key}",
                product_key,
                txn_amount,
                txn_type,
                campaign_id,
                channel_id
            ))
            
            # Commit every 100 transactions
            if i % 100 == 0:
                conn.commit()
                print(f"Inserted {i+1} transactions into fact_transactions")
        except Exception as e:
            print(f"Error inserting transaction {i+1}: {e}")
            continue
    
    conn.commit()
    print("fact_transactions table populated!")
    
    # For fact_transactions_datavault
    for i in range(NUM_TRANSACTIONS):
        try:
            txn_date = random_date()
            date_key = int(txn_date.strftime('%Y%m%d'))
            
            # Skip if date_key not in our dimension table
            if date_key not in dim_data['date_keys']:
                continue
            
            txn_hk = generate_hash_key(f"TXN_DV_{i}")
            customer_key = random.choice(dim_data['customer_ids'])
            product_key = random.choice(dim_data['product_keys'])
            branch_key = random.choice(dim_data['branch_keys']) if random.random() < 0.7 and dim_data['branch_keys'] else None
            txn_type = random.choice(transaction_types)
            txn_amount = random.uniform(5, 5000)
            
            cursor.execute('''
            INSERT INTO fact_transactions_datavault (
                transaction_key, txn_hk, customer_key, product_key, date_key, 
                branch_key, txn_type, txn_amount, txn_currency, merchant_category, 
                txn_timestamp, load_dts
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                max_dv_transaction_id + i + 1,
                txn_hk,
                customer_key,
                product_key,
                date_key,
                branch_key,
                txn_type,
                txn_amount,
                random.choice(currencies),
                random.choice(dim_data['merchant_categories']) if dim_data['merchant_categories'] else "Retail",
                txn_date.isoformat(),
                datetime.datetime.now().isoformat()
            ))
            
            # Commit every 100 transactions
            if i % 100 == 0:
                conn.commit()
                print(f"Inserted {i+1} transactions into fact_transactions_datavault")
        except Exception as e:
            print(f"Error inserting transaction {i+1}: {e}")
            continue
    
    conn.commit()
    print("fact_transactions_datavault table populated!")
    
def populate_fact_spend_cc(conn, dim_data):
    """Populate fact_spend_cc table."""
    print("\nPopulating fact_spend_cc table...")
    cursor = conn.cursor()
    
    # Get current max ID
    max_cc_id = get_max_id(conn, "fact_spend_cc", "spend_txn_key")
    print(f"Current max credit card transaction ID: {max_cc_id}")
    
    # Generate credit card spending data
    currencies = ["USD", "EUR", "GBP", "CAD"]
    reward_programs = ["Cash Back", "Travel Points", "Shopping Points", None]
    
    # See if we have credit card products
    credit_card_keys = dim_data['credit_card_keys']
    if not credit_card_keys:
        print("No credit card products found. Using all products as fallback.")
        credit_card_keys = dim_data['product_keys']
    
    for i in range(NUM_CREDIT_CARD_TXNS):
        try:
            txn_date = random_date()
            date_key = int(txn_date.strftime('%Y%m%d'))
            
            # Skip if date_key not in our dimension table
            if date_key not in dim_data['date_keys']:
                continue
            
            txn_hk = generate_hash_key(f"CC_TXN_{i}")
            customer_key = random.choice(dim_data['customer_ids'])
            product_key = random.choice(credit_card_keys)
            merchant_key = random.choice(dim_data['merchant_ids'])
            txn_amount = random.uniform(5, 1000)
            
            # Credit card specific data
            credit_limit = random.uniform(1000, 10000)
            available_credit = credit_limit - txn_amount
            rewards_earned = txn_amount * 0.01  # 1% rewards
            
            cursor.execute('''
            INSERT INTO fact_spend_cc (
                spend_txn_key, txn_hk, customer_key, product_key, date_key, 
                merchant_key, txn_amount, txn_currency, rewards_earned, 
                interest_charged, credit_limit, available_credit, 
                reward_program, txn_timestamp, load_dts
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                max_cc_id + i + 1,
                txn_hk,
                customer_key,
                product_key,
                date_key,
                merchant_key,
                txn_amount,
                random.choice(currencies),
                rewards_earned,
                0.00,  # No interest charged initially
                credit_limit,
                available_credit,
                random.choice(reward_programs),
                txn_date.isoformat(),
                datetime.datetime.now().isoformat()
            ))
            
            # Commit every 50 transactions
            if i % 50 == 0:
                conn.commit()
                print(f"Inserted {i+1} credit card transactions")
        except Exception as e:
            print(f"Error inserting credit card transaction {i+1}: {e}")
            continue
    
    conn.commit()
    print("fact_spend_cc table populated!")

def populate_fact_repayments(conn, dim_data):
    """Populate fact_repayments table."""
    print("\nPopulating fact_repayments table...")
    cursor = conn.cursor()
    
    # Get current max ID
    max_repayment_id = get_max_id(conn, "fact_repayments", "repayment_key")
    print(f"Current max repayment ID: {max_repayment_id}")
    
    # Generate repayment data
    payment_methods = ["ACH", "CHECK", "ONLINE_BANKING", "AUTOMATIC_DEBIT"]
    payment_statuses = ["COMPLETED", "PENDING", "FAILED", "OVERDUE"]
    
    # See if we have loan products
    loan_keys = dim_data['loan_keys']
    if not loan_keys:
        print("No loan products found. Using all products as fallback.")
        loan_keys = dim_data['product_keys']
    
    for i in range(NUM_REPAYMENTS):
        try:
            repayment_date = random_date()
            date_key = int(repayment_date.strftime('%Y%m%d'))
            
            # Skip if date_key not in our dimension table
            if date_key not in dim_data['date_keys']:
                continue
            
            repayment_id = f"REPAY-{1000 + max_repayment_id + i}"
            customer_key = random.choice(dim_data['customer_ids'])
            product_key = random.choice(loan_keys)
            
            # Generate repayment amount components
            principal_amt = random.uniform(10000, 200000)  # Initial loan amount
            principal = random.uniform(100, 1000)          # Amount towards principal
            interest = random.uniform(50, 500)             # Interest component
            fee = random.uniform(0, 50)                    # Fees if any
            total_amount = principal + interest + fee       # Total payment
            remaining = principal_amt - principal           # Remaining balance
            
            cursor.execute('''
            INSERT INTO fact_repayments (
                repayment_key, repayment_id, customer_key, product_key, date_key,
                repayment_amount, principal_component, interest_component, 
                fee_component, remaining_principal, payment_method, 
                payment_status, days_past_due, repayment_timestamp, due_date, load_dts
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                max_repayment_id + i + 1,
                repayment_id,
                customer_key,
                product_key,
                date_key,
                total_amount,
                principal,
                interest,
                fee,
                remaining,
                random.choice(payment_methods),
                random.choice(payment_statuses),
                random.randint(0, 60) if random.random() < 0.1 else 0,  # 10% with past due days
                repayment_date.isoformat(),
                (repayment_date - timedelta(days=random.randint(0, 30))).isoformat(),  # Due date
                datetime.datetime.now().isoformat()
            ))
            
            # Commit every 50 repayments
            if i % 50 == 0:
                conn.commit()
                print(f"Inserted {i+1} repayments")
        except Exception as e:
            print(f"Error inserting repayment {i+1}: {e}")
            continue
    
    conn.commit()
    print("fact_repayments table populated!")

def populate_fact_customer_channel_activity(conn, dim_data):
    """Populate fact_customer_channel_activity table."""
    print("\nPopulating fact_customer_channel_activity table...")
    cursor = conn.cursor()
    
    # Get current max ID
    max_activity_id = get_max_id(conn, "fact_customer_channel_activity", "activity_key")
    print(f"Current max activity ID: {max_activity_id}")
    
    # Get channel types to generate appropriate activity metrics
    cursor.execute("SELECT id, type FROM dim_channels")
    channel_data = cursor.fetchall()
    
    # Generate customer channel activity data
    for i in range(NUM_CHANNEL_ACTIVITIES):
        try:
            activity_date = random_date()
            date_key = int(activity_date.strftime('%Y%m%d'))
            
            # Skip if date_key not in our dimension table
            if date_key not in dim_data['date_keys']:
                continue
            
            # Randomly select customer and channel
            customer_key = random.choice(dim_data['customer_ids'])
            channel_id, channel_type = random.choice(channel_data)
            
            # Generate activity metrics based on channel type
            opens = random.randint(0, 10) if channel_type in ['EMAIL', 'SMS'] else 0
            clicks = random.randint(0, opens) if opens > 0 else 0
            logins = random.randint(0, 5) if channel_type in ['APP', 'WEB'] else 0
            session_count = random.randint(1, 10) if logins > 0 else 0
            session_duration = random.randint(60, 1800) if session_count > 0 else None  # 1-30 minutes
            
            cursor.execute('''
            INSERT INTO fact_customer_channel_activity (
                activity_key, customer_key, date_key, channel_key, opens,
                clicks, logins, session_count, session_duration_seconds,
                conversion_count, bounce_count, activity_date, load_dts
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                max_activity_id + i + 1,
                customer_key,
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
            
            # Commit every 50 activities
            if i % 50 == 0:
                conn.commit()
                print(f"Inserted {i+1} channel activities")
        except Exception as e:
            print(f"Error inserting channel activity {i+1}: {e}")
            continue
    
    conn.commit()
    print("fact_customer_channel_activity table populated!")

def populate_fact_campaign_performance(conn, dim_data):
    """Populate fact_campaign_performance table."""
    print("\nPopulating fact_campaign_performance table...")
    cursor = conn.cursor()
    
    # Get current max ID
    max_cp_id = get_max_id(conn, "fact_campaign_performance", "id")
    print(f"Current max campaign performance ID: {max_cp_id}")
    
    # Get campaign and segment data to ensure proper relationships
    cursor.execute("SELECT id, segment_id FROM dim_campaigns")
    campaign_data = cursor.fetchall()
    
    # Generate campaign performance data
    performance_id = max_cp_id + 1
    
    # For each campaign, create performance records for different dates and channels
    for campaign_id, segment_id in campaign_data:
        # Get a random date range for the campaign (2-8 weeks)
        start_date = random_date(START_DATE, END_DATE - timedelta(days=60))
        end_date = start_date + timedelta(days=random.randint(14, 56))
        
        # Create performance records for 5 dates within the range
        for _ in range(5):
            record_date = random_date(start_date, end_date)
            date_key = int(record_date.strftime('%Y%m%d'))
            
            # Skip if date_key not in our dimension table
            if date_key not in dim_data['date_keys']:
                continue
            
            # Create performance for 2-3 different channels
            for channel_id in random.sample(dim_data['channel_ids'], k=min(3, len(dim_data['channel_ids']))):
                try:
                    # Generate metrics
                    impressions = random.randint(100, 10000)
                    clicks = random.randint(0, min(impressions, 1000))
                    conversions = random.randint(0, min(clicks, 100))
                    spend = random.uniform(50, 5000)
                    
                    cursor.execute('''
                    INSERT INTO fact_campaign_performance (
                        id, campaign_id, channel_id, segment_id, date_key,
                        impressions, clicks, conversions, spend
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ''', (
                        performance_id,
                        campaign_id,
                        channel_id,
                        segment_id if segment_id else random.choice(dim_data['segment_ids']),
                        date_key,
                        impressions,
                        clicks,
                        conversions,
                        spend
                    ))
                    
                    performance_id += 1
                except Exception as e:
                    print(f"Error inserting campaign performance record {performance_id}: {e}")
                    continue
        
        # Commit after each campaign
        conn.commit()
        print(f"Inserted performance data for campaign {campaign_id}")
    
    print(f"fact_campaign_performance table populated with {performance_id - max_cp_id} records!")

def populate_fact_segment_performance(conn, dim_data):
    """Populate fact_segment_performance table."""
    print("\nPopulating fact_segment_performance table...")
    cursor = conn.cursor()
    
    # Get current max ID
    max_sp_id = get_max_id(conn, "fact_segment_performance", "id")
    print(f"Current max segment performance ID: {max_sp_id}")
    
    # Generate segment performance data - weekly data for the last 6 months
    performance_id = max_sp_id + 1
    start_date = datetime.datetime.now() - timedelta(days=180)
    end_date = datetime.datetime.now()
    current_date = start_date
    
    while current_date <= end_date:
        date_key = int(current_date.strftime('%Y%m%d'))
        
        # Skip if date_key not in our dimension table
        if date_key in dim_data['date_keys']:
            # Create performance for each segment
            for segment_id in dim_data['segment_ids']:
                try:
                    # Generate engagement score (0-100)
                    engagement_score = random.uniform(0, 100)
                    
                    cursor.execute('''
                    INSERT INTO fact_segment_performance (
                        id, segment_id, date_key, engagement_score
                    ) VALUES (?, ?, ?, ?)
                    ''', (
                        performance_id,
                        segment_id,
                        date_key,
                        engagement_score
                    ))
                    
                    performance_id += 1
                except Exception as e:
                    print(f"Error inserting segment performance record {performance_id}: {e}")
                    continue
        
        # Move to next week
        current_date += timedelta(days=7)
    
    conn.commit()
    print(f"fact_segment_performance table populated with {performance_id - max_sp_id} records!")

def populate_fact_channel_performance(conn, dim_data):
    """Populate fact_channel_performance table."""
    print("\nPopulating fact_channel_performance table...")
    cursor = conn.cursor()
    
    # Get current max ID
    max_chp_id = get_max_id(conn, "fact_channel_performance", "id")
    print(f"Current max channel performance ID: {max_chp_id}")
    
    # Generate channel performance data - monthly data for the last 6 months
    performance_id = max_chp_id + 1
    
    # Get campaign IDs to link to channels
    campaign_ids = dim_data['campaign_ids']
    
    # For each month in the last 6 months
    for month in range(6):
        # Get a date in this month
        month_date = datetime.datetime.now() - timedelta(days=30*month + random.randint(0, 29))
        date_key = int(month_date.strftime('%Y%m%d'))
        
        # Skip if date_key not in our dimension table
        if date_key not in dim_data['date_keys']:
            continue
        
        # For each channel, create a performance record
        for channel_id in dim_data['channel_ids']:
            try:
                # Generate metrics
                impressions = random.randint(1000, 50000)
                clicks = random.randint(0, min(impressions, 5000))
                
                cursor.execute('''
                INSERT INTO fact_channel_performance (
                    id, campaign_id, channel_id, date_key, impressions, clicks
                ) VALUES (?, ?, ?, ?, ?, ?)
                ''', (
                    performance_id,
                    random.choice(campaign_ids) if campaign_ids else None,  # Optional campaign link
                    channel_id,
                    date_key,
                    impressions,
                    clicks
                ))
                
                performance_id += 1
            except Exception as e:
                print(f"Error inserting channel performance record {performance_id}: {e}")
                continue
    
    conn.commit()
    print(f"fact_channel_performance table populated with {performance_id - max_chp_id} records!")

def populate_fact_feedback(conn, dim_data):
    """Populate fact_feedback table."""
    print("\nPopulating fact_feedback table...")
    cursor = conn.cursor()
    
    # Get current max ID
    max_feedback_id = get_max_id(conn, "fact_feedback", "id")
    print(f"Current max feedback ID: {max_feedback_id}")
    
    # Generate feedback data - 50 feedback entries
    for i in range(50):
        try:
            # Random customer and campaign
            customer_id = random.choice(dim_data['customer_ids'])
            campaign_id = random.choice(dim_data['campaign_ids']) if dim_data['campaign_ids'] else None
            
            # Generate feedback data
            rating = random.randint(1, 5)
            comments = [
                "Great service, very satisfied!",
                "The campaign was informative.",
                "I would have liked more details.",
                "Response time could be improved.",
                "Very professional team.",
                "The offer wasn't relevant to me.",
                "I'll definitely consider this in the future.",
                "Communication was clear and helpful.",
                "Not what I was looking for.",
                "Exceeded my expectations."
            ]
            
            # Random submission date in the last 3 months
            submitted_at = datetime.datetime.now() - timedelta(days=random.randint(0, 90))
            
            cursor.execute('''
            INSERT INTO fact_feedback (
                id, customer_id, campaign_id, rating, comments, submitted_at
            ) VALUES (?, ?, ?, ?, ?, ?)
            ''', (
                max_feedback_id + i + 1,
                customer_id,
                campaign_id,
                rating,
                random.choice(comments),
                submitted_at.isoformat()
            ))
            
            # Commit every 10 feedback entries
            if i % 10 == 0:
                conn.commit()
                print(f"Inserted {i+1} feedback entries")
        except Exception as e:
            print(f"Error inserting feedback {i+1}: {e}")
            continue
    
    conn.commit()
    print("fact_feedback table populated!")

def main():
    """Main function to populate all fact tables with meaningful data."""
    try:
        # Connect to the database
        conn = connect_db()
        
        # Get dimension data for relationships
        dim_data = get_dimension_data(conn)
        
        # Populate fact tables
        populate_fact_transactions(conn, dim_data)
        populate_fact_spend_cc(conn, dim_data)
        populate_fact_repayments(conn, dim_data)
        populate_fact_customer_channel_activity(conn, dim_data)
        populate_fact_campaign_performance(conn, dim_data)
        populate_fact_segment_performance(conn, dim_data)
        populate_fact_channel_performance(conn, dim_data)
        populate_fact_feedback(conn, dim_data)
        
        # Close the connection
        conn.close()
        print("\nAll fact tables populated successfully!")
        
    except Exception as e:
        print(f"Error: {e}")
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main() 
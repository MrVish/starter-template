#!/usr/bin/env python
"""
Script to populate database with dummy data for testing and development.
This script will create realistic data in dim tables first, then populate
fact tables with relationships to the dimension data.

Run from the project root with:
python backend/scripts/populate_dummy_data.py
"""

import os
import sys
import random
import string
import hashlib
from datetime import datetime, timedelta
from decimal import Decimal
import uuid

# Add parent directory to Python path to import modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from extensions import db
from app import create_app

# Import models
from models.dim_dates import DimDate
from models.dim_customers import DimCustomer
from models.dim_customer_ai_features import DimCustomerAIFeatures
from models.dim_segments import DimSegment
from models.dim_contact_preferences import DimContactPreferences
from models.dim_channels import DimChannel, ChannelType
from models.dim_products import DimProduct
from models.dim_merchants import DimMerchant
from models.dim_branches import DimBranch
from models.dim_campaigns import DimCampaign
from models.dim_campaign_templates import DimCampaignTemplate
from models.dim_data_sources import DimDataSource

# Import fact tables
from models.fact_transactions_main import FactTransactionMain
from models.fact_spend_cc import FactSpendCC
from models.fact_repayments import FactRepayment
from models.fact_customer_channel_activity import FactCustomerChannelActivity
from models.fact_campaign_performance import FactCampaignPerformance
from models.fact_channel_performance import FactChannelPerformance
from models.fact_segment_performance import FactSegmentPerformance

# Constants for data generation
NUM_CUSTOMERS = 100
NUM_SEGMENTS = 5
NUM_PRODUCTS = 20
NUM_MERCHANTS = 30
NUM_BRANCHES = 15
NUM_CAMPAIGNS = 10
NUM_TRANSACTIONS = 1000
NUM_CREDIT_CARD_TXNS = 500
NUM_REPAYMENTS = 200
NUM_CHANNEL_ACTIVITIES = 300
START_DATE = datetime(2023, 1, 1)
END_DATE = datetime.now()

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

# Create Flask app context
app = create_app()

# Helper to get or create date dimension record
def get_or_create_date(date_obj, session):
    """Get or create a date dimension record."""
    date_key = int(date_obj.strftime('%Y%m%d'))
    date_dim = session.query(DimDate).filter_by(id=date_key).first()
    
    if not date_dim:
        date_dim = DimDate.create_from_date(date_obj, session)
    
    return date_dim

# Helper to clean existing data if needed
def clean_existing_data():
    """Clean existing data from the database."""
    with app.app_context():
        print("Cleaning existing data...")
        # Delete data from fact tables first (due to foreign key constraints)
        db.session.query(FactSegmentPerformance).delete()
        db.session.query(FactChannelPerformance).delete()
        db.session.query(FactCampaignPerformance).delete()
        db.session.query(FactCustomerChannelActivity).delete()
        db.session.query(FactRepayment).delete()
        db.session.query(FactSpendCC).delete()
        db.session.query(FactTransactionMain).delete()
        db.session.query(DimContactPreferences).delete()
        db.session.query(DimCustomerAIFeatures).delete()
        db.session.query(DimCustomer).delete()
        db.session.query(DimCampaign).delete()
        db.session.query(DimCampaignTemplate).delete()
        db.session.query(DimSegment).delete()
        db.session.query(DimChannel).delete()
        db.session.query(DimProduct).delete()
        db.session.query(DimMerchant).delete()
        db.session.query(DimBranch).delete()
        db.session.query(DimDataSource).delete()
        # We don't delete dates as they're useful to keep
        db.session.commit()
        print("Database cleaned.")

def populate_dimensions():
    """Populate all dimension tables with dummy data."""
    with app.app_context():
        print("Populating dimension tables...")
        
        # Create dates for the last 2 years
        print("Creating date dimensions...")
        start = datetime(2022, 1, 1)
        end = datetime.now()
        current = start
        while current <= end:
            get_or_create_date(current, db.session)
            current += timedelta(days=1)
        
        # Create segments
        print("Creating segments...")
        segment_names = [
            "Premium Banking Clients",
            "Digital Banking Power Users",
            "Wealth Management Portfolio",
            "New Client Onboarding",
            "Credit Card Heavy Users"
        ]
        segments = []
        for i, name in enumerate(segment_names):
            segment = DimSegment(
                id=i+1,  # Explicitly set ID
                name=name,
                definition=f"Sample definition for {name}"
            )
            db.session.add(segment)
            segments.append(segment)
        db.session.commit()
        
        # Create customers
        print("Creating customers...")
        customers = []
        locations = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", 
                    "San Antonio", "San Diego", "Dallas", "San Francisco"]
        income_brackets = ["Low", "Medium", "High", "Very High"]
        risk_profiles = ["Conservative", "Moderate", "Aggressive"]
        
        for i in range(NUM_CUSTOMERS):
            # Create customer
            joined_date = random_date(START_DATE - timedelta(days=365*5), END_DATE)
            customer = DimCustomer(
                id=i+1,  # Explicitly set ID
                full_name=f"Customer {i+1}",
                email=f"customer{i+1}@example.com",
                dob=random_date(datetime(1960, 1, 1), datetime(2000, 1, 1)).date(),
                gender=random.choice(["Male", "Female", "Other"]),
                income_bracket=random.choice(income_brackets),
                risk_profile=random.choice(risk_profiles),
                location=random.choice(locations),
                joined_date=joined_date.date(),
                active_product_count=random.randint(1, 5),
                latest_segment_id=random.choice(segments).id
            )
            db.session.add(customer)
            customers.append(customer)
            
            # Create AI features
            ai_features = DimCustomerAIFeatures(
                customer_id=i+1,  # This references the explicit customer ID
                churn_risk_score=Decimal(str(random.uniform(0, 100))).quantize(Decimal('0.01')),
                lifetime_value_score=Decimal(str(random.uniform(500, 50000))).quantize(Decimal('0.01')),
                propensity_score=Decimal(str(random.uniform(0, 100))).quantize(Decimal('0.01')),
                model_version="v1.0.0",
                scored_at=datetime.now() - timedelta(days=random.randint(1, 30))
            )
            db.session.add(ai_features)
            
            # Create contact preferences
            contact_prefs = DimContactPreferences(
                customer_id=i+1,  # This references the explicit customer ID
                do_not_email=random.random() < 0.1,  # 10% opt out of email
                do_not_sms=random.random() < 0.2,    # 20% opt out of SMS
                preferred_contact_time=random.choice(["morning", "afternoon", "evening"])
            )
            db.session.add(contact_prefs)
        
        db.session.commit()
            
        # Create channels
        print("Creating channels...")
        channels = []
        channel_data = [
            ("Email Marketing", ChannelType.EMAIL),
            ("SMS Alerts", ChannelType.SMS),
            ("Mobile App", ChannelType.APP),
            ("Online Banking", ChannelType.WEB),
            ("Facebook", ChannelType.SOCIAL),
            ("Instagram", ChannelType.SOCIAL),
            ("Direct Mail", None),
            ("Branch Visits", None)
        ]
        
        for i, (name, channel_type) in enumerate(channel_data):
            channel = DimChannel(
                id=i+1,  # Explicitly set ID
                name=name,
                type=channel_type
            )
            db.session.add(channel)
            channels.append(channel)
        
        db.session.commit()
        
        # Create campaign templates
        print("Creating campaign templates...")
        templates = []
        template_names = [
            "New Product Announcement",
            "Special Offer",
            "Seasonal Promotion",
            "Loyalty Rewards",
            "Account Update"
        ]
        
        for i, name in enumerate(template_names):
            template = DimCampaignTemplate(
                id=i+1,  # Explicitly set ID
                title=name,
                content=f"Template content for {name}"
            )
            db.session.add(template)
            templates.append(template)
        
        db.session.commit()
        
        # Create campaigns
        print("Creating campaigns...")
        campaign_types = ["awareness", "retargeting", "conversion", "retention", "loyalty"]
        campaign_statuses = ["active", "paused", "scheduled", "ended"]
        campaigns = []
        
        for i in range(NUM_CAMPAIGNS):
            start_date = random_date(START_DATE, END_DATE - timedelta(days=30)).date()
            end_date = start_date + timedelta(days=random.randint(7, 60))
            
            campaign = DimCampaign(
                id=i+1,  # Explicitly set ID
                name=f"Campaign {i+1}",
                type=random.choice(campaign_types),
                status=random.choice(campaign_statuses),
                budget=Decimal(str(random.uniform(5000, 50000))).quantize(Decimal('0.01')),
                start_date=start_date,
                end_date=end_date,
                segment_id=random.choice(segments).id,
                template_id=random.choice(templates).id
            )
            db.session.add(campaign)
            campaigns.append(campaign)
        
        db.session.commit()
        
        # Create products
        print("Creating products...")
        product_types = ["CREDIT_CARD", "HOME_LOAN", "PERSONAL_LOAN", "SAVINGS_ACCOUNT", "CHECKING_ACCOUNT"]
        statuses = ["ACTIVE", "DORMANT", "CLOSED"]
        reward_programs = ["Cash Back", "Travel Points", "Shopping Points", None]
        
        products = []
        for i in range(NUM_PRODUCTS):
            product_type = random.choice(product_types)
            
            # Create product hash key
            product_hk = generate_hash_key(f"PROD_{i}")
            
            # Generate appropriate values based on product type
            if product_type == "CREDIT_CARD":
                credit_limit = Decimal(str(random.uniform(500, 50000))).quantize(Decimal('0.01'))
                principal_amt = Decimal('0.00')
                interest_rate = Decimal(str(random.uniform(9.99, 24.99))).quantize(Decimal('0.01'))
                reward_program = random.choice(reward_programs)
                tenure_months = None
                property_type = None
            elif product_type in ["HOME_LOAN", "PERSONAL_LOAN"]:
                credit_limit = None
                principal_amt = Decimal(str(random.uniform(10000, 500000))).quantize(Decimal('0.01'))
                interest_rate = Decimal(str(random.uniform(2.99, 12.99))).quantize(Decimal('0.01'))
                reward_program = None
                tenure_months = random.randint(12, 360)
                property_type = random.choice(["Single Family", "Condo", "Multi-Family", None])
            else:  # Savings or checking account
                credit_limit = None
                principal_amt = Decimal(str(random.uniform(100, 50000))).quantize(Decimal('0.01'))
                interest_rate = Decimal(str(random.uniform(0.01, 5.0))).quantize(Decimal('0.01')) if product_type == "SAVINGS_ACCOUNT" else Decimal('0.00')
                reward_program = None
                tenure_months = None
                property_type = None
            
            product = DimProduct(
                product_key=i+1,  # Explicitly set ID
                product_hk=product_hk,
                account_number=f"ACCT-{100000 + i}",
                product_type=product_type,
                credit_limit=credit_limit,
                principal_amt=principal_amt,
                interest_rate_pct=interest_rate,
                status=random.choice(statuses),
                reward_program=reward_program,
                tenure_months=tenure_months,
                property_type=property_type,
                last_updated_dts=datetime.now() - timedelta(days=random.randint(0, 90))
            )
            db.session.add(product)
            products.append(product)
        
        db.session.commit()
        
        # Create merchants
        print("Creating merchants...")
        merchants = []
        merchant_categories = [
            "Dining", "Retail", "Travel", "Groceries", "Entertainment", 
            "Utilities", "Healthcare", "Education", "Professional Services"
        ]
        merchant_countries = ["USA", "Canada", "UK", "France", "Germany", "Japan", "Australia"]
        
        for i in range(NUM_MERCHANTS):
            merchant_name = f"Merchant {i+1}"
            merchant_hk = generate_hash_key(f"MERCH_{merchant_name}")
            
            merchant = DimMerchant(
                id=i+1,  # Explicitly set ID
                merchant_hk=merchant_hk,
                merchant_name=merchant_name,
                merchant_category=random.choice(merchant_categories),
                merchant_location=random.choice(locations),
                merchant_country=random.choice(merchant_countries),
                last_updated_dts=datetime.now() - timedelta(days=random.randint(0, 90))
            )
            db.session.add(merchant)
            merchants.append(merchant)
        
        db.session.commit()
        
        # Create branches
        print("Creating branches...")
        branches = []
        branch_types = ["FULL_SERVICE", "EXPRESS", "ATM", "DIGITAL"]
        regions = ["East", "West", "North", "South", "Central"]
        channel_categories = ["PHYSICAL", "DIGITAL", "HYBRID"]
        
        for i in range(NUM_BRANCHES):
            branch_code = f"BR-{1000 + i}"
            branch_hk = generate_hash_key(f"BRANCH_{branch_code}")
            
            branch = DimBranch(
                branch_key=i+1,  # Explicitly set ID
                branch_hk=branch_hk,
                branch_code=branch_code,
                branch_name=f"Branch {i+1}",
                region=random.choice(regions),
                branch_type=random.choice(branch_types),
                channel_category=random.choice(channel_categories),
                active_flag="Y" if random.random() < 0.9 else "N",  # 90% active
                last_updated_dts=datetime.now() - timedelta(days=random.randint(0, 90))
            )
            db.session.add(branch)
            branches.append(branch)
        
        db.session.commit()
        
        # Create data sources
        print("Creating data sources...")
        data_sources = []
        source_names = ["Core Banking", "CRM", "Digital Banking", "Card Processor", "ETL Pipelines"]
        
        for i, name in enumerate(source_names):
            source = DimDataSource(
                id=i+1,  # Explicitly set ID
                name=name
            )
            db.session.add(source)
            data_sources.append(source)
        
        db.session.commit()
        
        print("Dimension tables populated successfully!")
        return {
            'customers': customers,
            'segments': segments,
            'channels': channels,
            'campaigns': campaigns,
            'products': products,
            'merchants': merchants,
            'branches': branches,
            'data_sources': data_sources
        }

def populate_facts(dimensions):
    """Populate fact tables with dummy data."""
    with app.app_context():
        print("Populating fact tables...")
        
        # Fetch fresh objects from database to avoid DetachedInstanceError
        customers = db.session.query(DimCustomer).all()
        products = db.session.query(DimProduct).all()
        merchants = db.session.query(DimMerchant).all()
        branches = db.session.query(DimBranch).all()
        channels = db.session.query(DimChannel).all()
        campaigns = db.session.query(DimCampaign).all()
        segments = db.session.query(DimSegment).all()
        
        # Create transactions
        print("Creating transactions...")
        transaction_types = ["PURCHASE", "PAYMENT", "WITHDRAWAL", "DEPOSIT", "TRANSFER", "FEE"]
        currencies = ["USD", "EUR", "GBP", "CAD"]
        
        for i in range(NUM_TRANSACTIONS):
            # Generate random transaction data
            txn_date = random_date(START_DATE, END_DATE)
            date_key = int(txn_date.strftime('%Y%m%d'))
            txn_amount = Decimal(str(random.uniform(5, 5000))).quantize(Decimal('0.01'))
            txn_type = random.choice(transaction_types)
            customer = random.choice(customers)
            product = random.choice(products)
            branch = random.choice(branches) if random.random() < 0.7 else None  # 70% have branch
            
            # Create transaction hash key
            txn_hk = generate_hash_key(f"TXN_{i}")
            
            # Create main transaction
            txn = FactTransactionMain(
                transaction_key=i+1,  # Explicitly set ID
                txn_hk=txn_hk,
                customer_key=customer.id,
                product_key=product.product_key,
                date_key=date_key,
                branch_key=branch.branch_key if branch else None,
                txn_type=txn_type,
                txn_amount=txn_amount,
                txn_currency=random.choice(currencies),
                merchant_category=random.choice(merchants).merchant_category,
                txn_timestamp=txn_date,
                load_dts=datetime.now()
            )
            db.session.add(txn)
            
            # Commit every 100 transactions to avoid memory issues
            if i % 100 == 0:
                db.session.commit()
        
        db.session.commit()
        
        # Create credit card spending transactions
        print("Creating credit card transactions...")
        credit_card_products = [p for p in products if p.product_type == "CREDIT_CARD"]
        
        for i in range(NUM_CREDIT_CARD_TXNS):
            # Choose a credit card product
            if not credit_card_products:
                continue
                
            product = random.choice(credit_card_products)
            customer = random.choice(customers)
            merchant = random.choice(merchants)
            txn_date = random_date(START_DATE, END_DATE)
            date_key = int(txn_date.strftime('%Y%m%d'))
            txn_amount = Decimal(str(random.uniform(5, 1000))).quantize(Decimal('0.01'))
            
            # Create transaction hash key
            txn_hk = generate_hash_key(f"CC_TXN_{i}")
            
            # Create credit card transaction
            cc_txn = FactSpendCC(
                spend_txn_key=i+1,  # Explicitly set ID
                txn_hk=txn_hk,
                customer_key=customer.id,
                product_key=product.product_key,
                date_key=date_key,
                merchant_key=merchant.id,
                txn_amount=txn_amount,
                txn_currency=random.choice(currencies),
                rewards_earned=Decimal(str(txn_amount * Decimal('0.01'))).quantize(Decimal('0.01')),  # 1% rewards
                interest_charged=Decimal('0.00'),
                credit_limit=product.credit_limit,
                available_credit=product.credit_limit - txn_amount,
                reward_program=product.reward_program,
                txn_timestamp=txn_date,
                load_dts=datetime.now()
            )
            db.session.add(cc_txn)
            
            # Commit every 100 transactions to avoid memory issues
            if i % 100 == 0:
                db.session.commit()
        
        db.session.commit()
        
        # Create loan repayments
        print("Creating loan repayments...")
        loan_products = [p for p in products if p.product_type in ["HOME_LOAN", "PERSONAL_LOAN"]]
        payment_methods = ["ACH", "CHECK", "ONLINE_BANKING", "AUTOMATIC_DEBIT"]
        payment_statuses = ["COMPLETED", "PENDING", "FAILED", "OVERDUE"]
        
        for i in range(NUM_REPAYMENTS):
            # Choose a loan product
            if not loan_products:
                continue
                
            product = random.choice(loan_products)
            customer = random.choice(customers)
            repayment_date = random_date(START_DATE, END_DATE)
            date_key = int(repayment_date.strftime('%Y%m%d'))
            
            # Create repayment hash key
            repayment_id = f"REPAY-{1000 + i}"
            
            # Generate repayment amount and components
            principal = Decimal(str(random.uniform(100, 2000))).quantize(Decimal('0.01'))
            interest = Decimal(str(random.uniform(50, 500))).quantize(Decimal('0.01'))
            fee = Decimal(str(random.uniform(0, 50))).quantize(Decimal('0.01'))
            total_amount = principal + interest + fee
            
            # Create repayment record
            repayment = FactRepayment(
                repayment_key=i+1,  # Explicitly set ID
                repayment_id=repayment_id,
                customer_key=customer.id,
                product_key=product.product_key,
                date_key=date_key,
                repayment_amount=total_amount,
                principal_component=principal,
                interest_component=interest,
                fee_component=fee,
                remaining_principal=product.principal_amt - principal,
                payment_method=random.choice(payment_methods),
                payment_status=random.choice(payment_statuses),
                days_past_due=random.randint(0, 60) if random.random() < 0.1 else 0,  # 10% with past due days
                repayment_timestamp=repayment_date,
                due_date=repayment_date - timedelta(days=random.randint(0, 30)),
                load_dts=datetime.now()
            )
            db.session.add(repayment)
        
        db.session.commit()
        
        # Create customer channel activity
        print("Creating customer channel activity...")
        
        for i in range(NUM_CHANNEL_ACTIVITIES):
            customer = random.choice(customers)
            channel = random.choice(channels)
            activity_date = random_date(START_DATE, END_DATE)
            date_key = int(activity_date.strftime('%Y%m%d'))
            
            # Generate activity metrics based on channel type
            opens = random.randint(0, 10) if hasattr(channel, 'type') and channel.type in [ChannelType.EMAIL, ChannelType.SMS] else 0
            clicks = random.randint(0, opens) if opens > 0 else 0
            logins = random.randint(0, 5) if hasattr(channel, 'type') and channel.type in [ChannelType.APP, ChannelType.WEB] else 0
            session_count = random.randint(1, 10) if logins > 0 else 0
            session_duration = random.randint(60, 1800) if session_count > 0 else None  # 1-30 minutes
            
            activity = FactCustomerChannelActivity(
                activity_key=i+1,  # Explicitly set ID
                customer_key=customer.id,
                date_key=date_key,
                channel_key=channel.id,
                opens=opens,
                clicks=clicks,
                logins=logins,
                session_count=session_count,
                session_duration_seconds=session_duration,
                conversion_count=random.randint(0, 2),
                bounce_count=random.randint(0, 5),
                activity_date=activity_date,
                load_dts=datetime.now()
            )
            db.session.add(activity)
        
        db.session.commit()
        
        # Create campaign performance facts
        print("Creating campaign performance facts...")
        
        # For each campaign, create performance records for different dates and channels
        performance_id = 1  # Track ID for campaign performance
        
        for campaign in campaigns:
            if not campaign.start_date or not campaign.end_date:
                continue
                
            # Create performance records for each day between start and end date
            current_date = campaign.start_date
            while current_date <= campaign.end_date:
                date_key = int(current_date.strftime('%Y%m%d'))
                
                # Create performance for different channels
                for channel in random.sample(channels, k=min(3, len(channels))):
                    # Generate metrics
                    impressions = random.randint(100, 10000)
                    clicks = random.randint(0, min(impressions, 1000))
                    conversions = random.randint(0, min(clicks, 100))
                    spend = Decimal(str(random.uniform(50, 5000))).quantize(Decimal('0.01'))
                    
                    performance = FactCampaignPerformance(
                        id=performance_id,  # Explicitly set ID
                        campaign_id=campaign.id,
                        channel_id=channel.id,
                        segment_id=campaign.segment_id,
                        date_key=date_key,
                        impressions=impressions,
                        clicks=clicks,
                        conversions=conversions,
                        spend=spend
                    )
                    db.session.add(performance)
                    performance_id += 1
                
                # Move to next day
                current_date += timedelta(days=1)
                
                # Commit every 20 days to avoid memory issues
                if current_date.day % 20 == 0:
                    db.session.commit()
        
        db.session.commit()
        
        # Create channel performance facts
        print("Creating channel performance facts...")
        
        # Create 6 months of channel performance data
        channel_perf_id = 1  # Track ID for channel performance
        start_date = datetime.now() - timedelta(days=180)
        end_date = datetime.now()
        current_date = start_date
        
        while current_date <= end_date:
            date_key = int(current_date.strftime('%Y%m%d'))
            
            # Create performance for each channel
            for channel in channels:
                # Generate metrics
                impressions = random.randint(1000, 50000)
                clicks = random.randint(0, min(impressions, 5000))
                
                performance = FactChannelPerformance(
                    id=channel_perf_id,  # Explicitly set ID
                    channel_id=channel.id,
                    date_key=date_key,
                    impressions=impressions,
                    clicks=clicks
                )
                db.session.add(performance)
                channel_perf_id += 1
            
            # Move to next day
            current_date += timedelta(days=1)
            
            # Commit every 30 days to avoid memory issues
            if current_date.day % 30 == 0:
                db.session.commit()
        
        db.session.commit()
        
        # Create segment performance facts
        print("Creating segment performance facts...")
        
        # Create 6 months of segment performance data
        segment_perf_id = 1  # Track ID for segment performance
        start_date = datetime.now() - timedelta(days=180)
        end_date = datetime.now()
        current_date = start_date
        
        while current_date <= end_date:
            date_key = int(current_date.strftime('%Y%m%d'))
            
            # Create performance for each segment
            for segment in segments:
                # Generate metrics - engagement score 0-100
                engagement_score = Decimal(str(random.uniform(0, 100))).quantize(Decimal('0.01'))
                
                performance = FactSegmentPerformance(
                    id=segment_perf_id,  # Explicitly set ID
                    segment_id=segment.id,
                    date_key=date_key,
                    engagement_score=engagement_score
                )
                db.session.add(performance)
                segment_perf_id += 1
            
            # Move to next day (use weekly data for segments)
            current_date += timedelta(days=7)
        
        db.session.commit()
        
        print("Fact tables populated successfully!")

if __name__ == "__main__":
    print("Starting data population...")
    clean_existing_data()  # Clean existing data before populating
    dimensions = populate_dimensions()
    populate_facts(dimensions)
    print("All data populated successfully!") 
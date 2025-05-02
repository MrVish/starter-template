#!/usr/bin/env python
"""
Script to verify the data in the database for testing and development.
This script will display counts and sample records from various tables.

Run from the project root with:
python backend/scripts/verify_data.py
"""

import os
import sys
from pprint import pprint

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

# Create Flask app context
app = create_app()

def print_table_counts():
    """Print row counts for all tables."""
    with app.app_context():
        print("\n=== TABLE ROW COUNTS ===")
        
        # Dimension tables
        dim_date_count = db.session.query(DimDate).count()
        dim_customer_count = db.session.query(DimCustomer).count()
        dim_segment_count = db.session.query(DimSegment).count()
        dim_channel_count = db.session.query(DimChannel).count()
        dim_product_count = db.session.query(DimProduct).count()
        dim_merchant_count = db.session.query(DimMerchant).count()
        dim_branch_count = db.session.query(DimBranch).count()
        dim_campaign_count = db.session.query(DimCampaign).count()
        
        # Fact tables
        fact_transaction_count = db.session.query(FactTransactionMain).count()
        fact_spend_cc_count = db.session.query(FactSpendCC).count()
        fact_repayment_count = db.session.query(FactRepayment).count()
        fact_channel_activity_count = db.session.query(FactCustomerChannelActivity).count()
        fact_campaign_perf_count = db.session.query(FactCampaignPerformance).count()
        fact_channel_perf_count = db.session.query(FactChannelPerformance).count()
        fact_segment_perf_count = db.session.query(FactSegmentPerformance).count()
        
        # Print counts
        print(f"DimDate: {dim_date_count} rows")
        print(f"DimCustomer: {dim_customer_count} rows")
        print(f"DimSegment: {dim_segment_count} rows")
        print(f"DimChannel: {dim_channel_count} rows")
        print(f"DimProduct: {dim_product_count} rows")
        print(f"DimMerchant: {dim_merchant_count} rows")
        print(f"DimBranch: {dim_branch_count} rows")
        print(f"DimCampaign: {dim_campaign_count} rows")
        print(f"FactTransactionMain: {fact_transaction_count} rows")
        print(f"FactSpendCC: {fact_spend_cc_count} rows")
        print(f"FactRepayment: {fact_repayment_count} rows")
        print(f"FactCustomerChannelActivity: {fact_channel_activity_count} rows")
        print(f"FactCampaignPerformance: {fact_campaign_perf_count} rows")
        print(f"FactChannelPerformance: {fact_channel_perf_count} rows")
        print(f"FactSegmentPerformance: {fact_segment_perf_count} rows")

def print_sample_records():
    """Print sample records from various tables."""
    with app.app_context():
        # Sample customers
        print("\n=== SAMPLE CUSTOMERS ===")
        customers = db.session.query(DimCustomer).limit(5).all()
        for customer in customers:
            print(f"ID: {customer.id}, Name: {customer.full_name}, Email: {customer.email}")
            # Get AI features
            ai_features = db.session.query(DimCustomerAIFeatures).filter_by(customer_id=customer.id).first()
            if ai_features:
                print(f"  Churn Risk: {ai_features.churn_risk_score}, LTV: {ai_features.lifetime_value_score}")
        
        # Sample segments
        print("\n=== SAMPLE SEGMENTS ===")
        segments = db.session.query(DimSegment).all()
        for segment in segments:
            print(f"ID: {segment.id}, Name: {segment.name}")
            # Count customers in segment
            customer_count = db.session.query(DimCustomer).filter_by(latest_segment_id=segment.id).count()
            print(f"  Customer Count: {customer_count}")
        
        # Sample products
        print("\n=== SAMPLE PRODUCTS ===")
        products = db.session.query(DimProduct).limit(5).all()
        for product in products:
            print(f"ID: {product.product_key}, Type: {product.product_type}, Account: {product.account_number}")
            
            # Count transactions for product
            txn_count = db.session.query(FactTransactionMain).filter_by(product_key=product.product_key).count()
            print(f"  Transaction Count: {txn_count}")
        
        # Sample transactions
        print("\n=== SAMPLE TRANSACTIONS ===")
        transactions = db.session.query(FactTransactionMain).limit(5).all()
        for txn in transactions:
            customer = db.session.query(DimCustomer).filter_by(id=txn.customer_key).first()
            product = db.session.query(DimProduct).filter_by(product_key=txn.product_key).first()
            print(f"Transaction: {txn.txn_type}, Amount: {txn.txn_amount}")
            print(f"  Customer: {customer.full_name if customer else 'Unknown'}")
            print(f"  Product: {product.product_type if product else 'Unknown'} - {product.account_number if product else 'Unknown'}")
        
        # Sample campaign performance
        print("\n=== SAMPLE CAMPAIGN PERFORMANCE ===")
        campaign_perfs = db.session.query(FactCampaignPerformance).limit(5).all()
        for perf in campaign_perfs:
            campaign = db.session.query(DimCampaign).filter_by(id=perf.campaign_id).first()
            channel = db.session.query(DimChannel).filter_by(id=perf.channel_id).first()
            
            print(f"Campaign: {campaign.name if campaign else 'Unknown'}")
            print(f"  Channel: {channel.name if channel else 'Unknown'}")
            print(f"  Impressions: {perf.impressions}, Clicks: {perf.clicks}, Conversions: {perf.conversions}")
            ctr = (perf.clicks / perf.impressions) if perf.impressions else 0
            print(f"  CTR: {ctr:.2%}")

if __name__ == "__main__":
    print("Verifying database data...")
    print_table_counts()
    print_sample_records()
    print("\nData verification complete!") 
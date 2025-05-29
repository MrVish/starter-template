#!/usr/bin/env python
"""
Test script to diagnose issues with Recent Campaigns functionality.
This script will:
1. Check database schema for the dim_campaigns table
2. Test campaign API endpoint
3. Generate a detailed report of any issues found

Run from the project root with:
python backend/scripts/test_campaign_api.py
"""

import os
import sys
import json
import logging
import argparse
from datetime import datetime
from decimal import Decimal
import traceback
import sqlite3

# Add parent directory to Python path to import modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("campaign_test")

try:
    from app import create_app
    from extensions import db
    from models.dim_campaigns import DimCampaign
    from services.dashboard_service import DashboardService
except Exception as e:
    logger.error(f"Import error: {str(e)}")
    logger.error(traceback.format_exc())
    print("Failed to import required modules. Make sure you're running from the project root.")
    sys.exit(1)

def get_sqlite_table_info(db_path="app.db"):
    """Get table schema information directly from SQLite."""
    logger.info(f"Checking SQLite table schema for {db_path}")
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Get list of tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        logger.info(f"Tables in database: {[t[0] for t in tables]}")
        
        # Check if dim_campaigns exists
        if ('dim_campaigns',) not in tables:
            logger.error("dim_campaigns table does not exist in the database!")
            return None
        
        # Get schema for dim_campaigns
        cursor.execute("PRAGMA table_info(dim_campaigns);")
        columns = cursor.fetchall()
        logger.info("dim_campaigns table schema:")
        
        column_info = []
        for col in columns:
            logger.info(f"  {col[1]} ({col[2]}) {'PRIMARY KEY' if col[5] == 1 else ''}")
            column_info.append({
                'cid': col[0],
                'name': col[1], 
                'type': col[2],
                'notnull': col[3],
                'default': col[4],
                'pk': col[5]
            })
        
        # Close connection
        conn.close()
        
        return column_info
    except Exception as e:
        logger.error(f"SQLite error: {str(e)}")
        return None

def check_campaign_schema():
    """Check if the DimCampaign model matches the database schema."""
    logger.info("Checking DimCampaign model schema...")
    
    # Get model fields
    model_fields = {}
    for attr in dir(DimCampaign):
        if not attr.startswith('_') and not callable(getattr(DimCampaign, attr)):
            attr_type = type(getattr(DimCampaign, attr))
            model_fields[attr] = attr_type.__name__
    
    logger.info(f"DimCampaign model fields: {model_fields}")
    
    # Get database schema
    db_columns = get_sqlite_table_info()
    
    if not db_columns:
        logger.error("Failed to retrieve database schema.")
        return False
    
    # Check for critical fields in database schema
    critical_fields = ['id', 'name', 'type', 'status', 'budget']
    db_column_names = [col['name'] for col in db_columns]
    missing_fields = [field for field in critical_fields if field not in db_column_names]
    
    if missing_fields:
        logger.error(f"Missing critical fields in database: {missing_fields}")
        return False
    
    logger.info("DimCampaign schema check passed!")
    return True

def test_dashboard_service():
    """Test the dashboard service get_recent_campaigns method."""
    logger.info("Testing DashboardService.get_recent_campaigns...")
    
    app = create_app()
    
    with app.app_context():
        try:
            # Initialize service
            dashboard_service = DashboardService(db.session)
            
            # Get recent campaigns
            logger.info("Calling get_recent_campaigns...")
            campaigns = dashboard_service.get_recent_campaigns(limit=5)
            
            # Check if we got real or mock data
            if campaigns and len(campaigns) > 0:
                logger.info(f"Retrieved {len(campaigns)} campaigns")
                
                # Check first campaign in detail
                first_campaign = campaigns[0]
                logger.info(f"First campaign: {json.dumps(first_campaign, default=str)}")
                
                # Check if required fields are present
                required_fields = ['id', 'name', 'type', 'status', 'budget', 'roi']
                missing_fields = [field for field in required_fields if field not in first_campaign]
                
                if missing_fields:
                    logger.warning(f"Campaign is missing fields: {missing_fields}")
                    return False
                
                return True
            else:
                logger.warning("No campaigns returned!")
                return False
        except Exception as e:
            logger.error(f"Error testing dashboard service: {str(e)}")
            logger.error(traceback.format_exc())
            return False

def test_api_endpoint():
    """Test the campaigns API endpoint directly."""
    logger.info("Testing /api/v1/dashboard/campaigns/recent endpoint...")
    
    app = create_app()
    
    with app.app_context():
        try:
            # Create test client
            client = app.test_client()
            
            # Make API request
            response = client.get('/api/v1/dashboard/campaigns/recent')
            
            # Check response
            logger.info(f"API Response Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json
                logger.info(f"API Response: {json.dumps(data, default=str)}")
                
                if data.get('success') and 'data' in data:
                    campaigns = data['data']
                    logger.info(f"API returned {len(campaigns)} campaigns")
                    return True
                else:
                    logger.warning("API returned unsuccessful response or missing data")
                    return False
            else:
                logger.error(f"API returned non-200 status code: {response.status_code}")
                return False
        except Exception as e:
            logger.error(f"Error testing API endpoint: {str(e)}")
            logger.error(traceback.format_exc())
            return False

def insert_test_campaign():
    """Insert a test campaign into the database."""
    logger.info("Inserting test campaign...")
    
    app = create_app()
    
    with app.app_context():
        try:
            # Check if we already have campaigns
            existing_count = db.session.query(DimCampaign).count()
            logger.info(f"Existing campaign count: {existing_count}")
            
            if existing_count > 0:
                logger.info("Campaigns already exist, skipping insertion")
                return True
            
            # Create test campaign
            from datetime import date, timedelta
            
            today = date.today()
            
            test_campaign = DimCampaign(
                name="Test Campaign",
                type="email",
                status="active",
                budget=Decimal("10000.00"),
                start_date=today - timedelta(days=10),
                end_date=today + timedelta(days=20)
            )
            
            # Add to session
            db.session.add(test_campaign)
            db.session.commit()
            
            logger.info(f"Test campaign inserted with ID: {test_campaign.id}")
            return True
        except Exception as e:
            logger.error(f"Error inserting test campaign: {str(e)}")
            logger.error(traceback.format_exc())
            db.session.rollback()
            return False

def fix_campaign_table():
    """Try to fix the campaign table if needed."""
    logger.info("Attempting to fix campaign table schema...")
    
    try:
        # Connect to SQLite directly
        conn = sqlite3.connect("app.db")
        cursor = conn.cursor()
        
        # Check if status column exists
        cursor.execute("PRAGMA table_info(dim_campaigns);")
        columns = [col[1] for col in cursor.fetchall()]
        
        # Add missing columns if needed
        if 'status' not in columns:
            logger.info("Adding status column to dim_campaigns")
            cursor.execute("ALTER TABLE dim_campaigns ADD COLUMN status TEXT DEFAULT 'active';")
        
        if 'budget' not in columns:
            logger.info("Adding budget column to dim_campaigns")
            cursor.execute("ALTER TABLE dim_campaigns ADD COLUMN budget NUMERIC(12,2) DEFAULT 0;")
        
        # Commit changes
        conn.commit()
        conn.close()
        
        logger.info("Schema fix attempted successfully")
        return True
    except Exception as e:
        logger.error(f"Error fixing schema: {str(e)}")
        return False

def run_tests(args):
    """Run all tests and generate a report."""
    logger.info("Starting Recent Campaigns tests...")
    
    results = {
        "schema_check": check_campaign_schema(),
        "service_test": False,
        "api_test": False,
        "fix_attempted": False,
        "fix_succeeded": False
    }
    
    # If schema check fails and fix is requested, try to fix
    if not results["schema_check"] and args.fix:
        logger.info("Schema check failed. Attempting to fix...")
        results["fix_attempted"] = True
        results["fix_succeeded"] = fix_campaign_table()
        
        # Recheck schema after fix
        if results["fix_succeeded"]:
            results["schema_check"] = check_campaign_schema()
    
    # If schema is valid, test service and API
    if results["schema_check"]:
        # Insert test campaign if requested
        if args.create:
            insert_test_campaign()
        
        # Test service and API
        results["service_test"] = test_dashboard_service()
        results["api_test"] = test_api_endpoint()
    
    # Generate report
    logger.info("\n" + "-" * 50)
    logger.info("TEST RESULTS SUMMARY")
    logger.info("-" * 50)
    logger.info(f"Database Schema Check: {'PASS' if results['schema_check'] else 'FAIL'}")
    logger.info(f"Dashboard Service Test: {'PASS' if results['service_test'] else 'FAIL'}")
    logger.info(f"API Endpoint Test: {'PASS' if results['api_test'] else 'FAIL'}")
    
    if results["fix_attempted"]:
        logger.info(f"Fix Attempted: YES")
        logger.info(f"Fix Succeeded: {'YES' if results['fix_succeeded'] else 'NO'}")
    
    logger.info("-" * 50)
    
    if all([results["schema_check"], results["service_test"], results["api_test"]]):
        logger.info("All tests PASSED!")
    else:
        logger.info("Some tests FAILED!")
        
        # Provide recommendations
        logger.info("\nRECOMMENDATIONS:")
        if not results["schema_check"]:
            logger.info("- The database schema doesn't match the model. Run with --fix to attempt fixing.")
        if not results["service_test"]:
            logger.info("- The dashboard service is not returning valid campaign data.")
        if not results["api_test"]:
            logger.info("- The API endpoint is not functioning correctly.")
        
        logger.info("\nNext steps:")
        logger.info("1. If schema issues were detected, run this script with --fix")
        logger.info("2. If no campaigns exist, run with --create to create a test campaign")
        logger.info("3. Check frontend API calls to ensure they are correctly formatted")
    
    logger.info("-" * 50)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Test Recent Campaigns functionality")
    parser.add_argument("--fix", action="store_true", help="Attempt to fix schema issues")
    parser.add_argument("--create", action="store_true", help="Create a test campaign if none exist")
    args = parser.parse_args()

    test_dashboard_service()
    
    #run_tests(args) 
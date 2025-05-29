from services.dashboard_service import DashboardService, decimal_to_float
from extensions import db
from decimal import Decimal
import json
from app import create_app

def test_campaign_by_id(campaign_id):
    """Test processing a specific campaign by ID"""
    print(f"\nTesting campaign with ID: {campaign_id}")
    
    try:
        # Create dashboard service instance
        dashboard_service = DashboardService(db.session)
        
        # Query the campaign
        from models.dim_campaigns import DimCampaign
        from models.fact_campaign_performance import FactCampaignPerformance
        from sqlalchemy import desc
        
        campaign = db.session.query(DimCampaign).get(campaign_id)
        
        if not campaign:
            print(f"Campaign with ID {campaign_id} not found")
            return
        
        print(f"Campaign found: {campaign.name}")
        print(f"Type: {campaign.type if hasattr(campaign, 'type') else 'unknown'}")
        print(f"Status: {campaign.status if hasattr(campaign, 'status') else 'unknown'}")
        
        # Check campaign attributes to identify potential issues
        for attr_name in ['budget', 'type', 'status', 'start_date', 'end_date']:
            if hasattr(campaign, attr_name):
                attr_val = getattr(campaign, attr_name)
                print(f"Attribute '{attr_name}': {attr_val} (type: {type(attr_val).__name__})")
                
                # Try decimal conversion for numeric attributes
                if attr_name == 'budget':
                    try:
                        float_val = decimal_to_float(attr_val, f"{attr_name} for campaign {campaign_id}")
                        print(f"  Converted to float: {float_val}")
                    except Exception as e:
                        print(f"  Error converting to float: {str(e)}")
            else:
                print(f"Attribute '{attr_name}' not found")
        
        # Get performance data
        performance = (
            db.session.query(FactCampaignPerformance)
            .filter_by(campaign_id=campaign.id)
            .order_by(desc(FactCampaignPerformance.date_key))
            .all()
        )
        
        print(f"Found {len(performance)} performance records")
        
        # Check the first performance record if exists
        if performance:
            perf = performance[0]
            print("First performance record:")
            for attr_name in ['spend', 'revenue', 'impressions', 'clicks', 'conversions']:
                if hasattr(perf, attr_name):
                    attr_val = getattr(perf, attr_name)
                    print(f"  {attr_name}: {attr_val} (type: {type(attr_val).__name__})")
                    
                    # Try decimal conversion
                    try:
                        float_val = decimal_to_float(attr_val, f"{attr_name} for performance")
                        print(f"    Converted to float: {float_val}")
                    except Exception as e:
                        print(f"    Error converting to float: {str(e)}")
                else:
                    print(f"  {attr_name} not found")
    
    except Exception as e:
        print(f"Error testing campaign {campaign_id}: {str(e)}")
        import traceback
        traceback.print_exc()

def test_get_recent_campaigns():
    """Test the get_recent_campaigns method"""
    print("Testing get_recent_campaigns function...")
    
    # Create dashboard service instance
    dashboard_service = DashboardService(db.session)
    
    # Test with use_mock_data=True (this should work regardless of database state)
    print("\nTesting with use_mock_data=True:")
    try:
        campaigns = dashboard_service.get_recent_campaigns(limit=3, use_mock_data=True)
        print(f"Retrieved {len(campaigns)} mock campaigns")
        for campaign in campaigns:
            print(f"Campaign: {campaign['name']} (ID: {campaign['id']})")
    except Exception as e:
        print(f"Error getting mock campaigns: {str(e)}")
    
    # Test with use_mock_data=False (attempt to get real data from database)
    print("\nTesting with use_mock_data=False:")
    try:
        # First get a list of all campaign IDs
        from models.dim_campaigns import DimCampaign
        
        campaign_ids = [c.id for c in db.session.query(DimCampaign.id).all()]
        print(f"Found {len(campaign_ids)} campaign IDs in database: {campaign_ids}")
        
        # Test each campaign individually
        for campaign_id in campaign_ids:
            test_campaign_by_id(campaign_id)
        
        # Now try to get all campaigns
        campaigns = dashboard_service.get_recent_campaigns(limit=3, use_mock_data=False)
        print(f"Retrieved {len(campaigns)} real campaigns")
        # Print more details about the campaigns to help debug
        for campaign in campaigns:
            print(json.dumps(campaign, indent=2, default=str))
    except Exception as e:
        print(f"Error getting real campaigns: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    print("Dashboard Service Test")
    print("=====================")
    
    # Create app and application context
    app = create_app()
    with app.app_context():
        # Run tests
        test_get_recent_campaigns()
    
    print("\nTests completed.") 
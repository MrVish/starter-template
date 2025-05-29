#!/usr/bin/env python
"""
Test Recent Campaigns API Endpoint

This script tests the backend API endpoint for recent campaigns.
"""

import os
import sys
import json
import logging
import requests

# Add parent directory to Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("test_api")

# Set the API URL
API_URL = "http://localhost:5000/api/v1/dashboard/campaigns/recent"
def test_recent_campaigns_api():
    """Test the recent campaigns API endpoint."""
    logger.info(f"Testing endpoint: {API_URL}")
    
    try:
        # Make the request
        response = requests.get(API_URL, params={"limit": 10})
        
        # Check response status
        logger.info(f"Response status code: {response.status_code}")
        
        if response.status_code == 200:
            # Parse JSON response
            data = response.json()
            
            # Pretty print the response
            logger.info("API Response:")
            print(json.dumps(data, indent=2))
            
            # Check if response has the expected structure
            if "success" in data and data["success"]:
                if "data" in data and isinstance(data["data"], list):
                    campaigns = data["data"]
                    logger.info(f"Retrieved {len(campaigns)} campaigns")
                    
                    # Check the first campaign
                    if campaigns:
                        first_campaign = campaigns[0]
                        logger.info(f"First campaign: {first_campaign['name']}")
                        
                        # Check required fields
                        required_fields = ["id", "name", "type", "status", "budget"]
                        missing_fields = [field for field in required_fields if field not in first_campaign]
                        
                        if missing_fields:
                            logger.error(f"Campaign is missing required fields: {missing_fields}")
                        else:
                            logger.info("Campaign has all required fields")
                    
                    return len(campaigns) > 0
                else:
                    logger.error("Response does not contain 'data' field or it's not a list")
            else:
                logger.error("Response indicates failure or missing 'success' field")
        else:
            logger.error(f"API request failed with status code: {response.status_code}")
            logger.error(f"Response: {response.text}")
    
    except requests.exceptions.ConnectionError:
        logger.error(f"Connection error. Is the backend server running at {API_URL}?")
    except Exception as e:
        logger.error(f"Error testing API endpoint: {str(e)}")
    
    return False

def main():
    """Main function."""
    # Test the API
    success = test_recent_campaigns_api()
    print(json)
    if success:
        logger.info("✅ API test passed!")
    else:
        logger.error("❌ API test failed!")

if __name__ == "__main__":
    main() 
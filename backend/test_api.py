import requests
import json
import traceback
import sys

def test_campaigns_api():
    """Test the campaigns API endpoint"""
    print("Testing campaigns API endpoint...")
    
    # Test with use_mock_data=false (fetch real data)
    url = "http://localhost:5000/api/v1/analytics/campaigns?timeRange=30d&use_mock_data=false"
    
    try:
        response = requests.get(url)
        print(f"Status code for real data: {response.status_code}")
        
        if response.status_code == 200:
            real_data = response.json()
            print("Success! Got real campaign data:")
            print(json.dumps(real_data, indent=2))
        else:
            print(f"Error response: {response.text}")
            
        # Also try with use_mock_data=true for comparison
        print("\nTesting with use_mock_data=true for comparison:")
        mock_url = "http://localhost:5000/api/v1/analytics/campaigns?timeRange=30d&use_mock_data=true"
        mock_response = requests.get(mock_url)
        print(f"Status code for mock data: {mock_response.status_code}")
        
        if mock_response.status_code == 200:
            mock_data = mock_response.json()
            print("Success! Got mock campaigns data:")
            print(json.dumps(mock_data, indent=2))
            
            # Compare the data
            if real_data and mock_data:
                print("\nComparing real vs mock data:")
                
                # Handle different response formats
                real_campaigns = real_data.get('data', [])
                if not isinstance(real_campaigns, list):
                    real_campaigns = real_campaigns.get('campaigns', [])
                    
                mock_campaigns = mock_data.get('data', [])
                if not isinstance(mock_campaigns, list):
                    mock_campaigns = mock_campaigns.get('campaigns', [])
                
                print(f"Real campaigns count: {len(real_campaigns)}")
                print(f"Mock campaigns count: {len(mock_campaigns)}")
                
                if real_campaigns and mock_campaigns:
                    # Check first campaign from each
                    print("\nSample real campaign:")
                    print(json.dumps(real_campaigns[0], indent=2))
                    
                    print("\nSample mock campaign:")
                    print(json.dumps(mock_campaigns[0], indent=2))
                    
                    # Check for structural differences
                    real_keys = set(real_campaigns[0].keys())
                    mock_keys = set(mock_campaigns[0].keys())
                    
                    if real_keys != mock_keys:
                        print("\nDifferent fields in real vs mock:")
                        print(f"Fields only in real: {real_keys - mock_keys}")
                        print(f"Fields only in mock: {mock_keys - real_keys}")
        else:
            print(f"Error response: {mock_response.text}")
            
    except Exception as e:
        print(f"Error calling API: {str(e)}")
        traceback.print_exc(file=sys.stdout)

if __name__ == "__main__":
    test_campaigns_api() 
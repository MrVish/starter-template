from services.analytics_service import AnalyticsService
from services.analytics_service_fix import decimal_to_float, get_safe_campaign_data
from extensions import db
from decimal import Decimal
import sys

def test_decimal_to_float():
    """Test the decimal_to_float function"""
    print("Testing decimal_to_float function...")
    
    # Test various inputs
    test_cases = [
        (Decimal('123.45'), 123.45),
        (123.45, 123.45),
        (123, 123.0),
        ('123.45', 123.45),
        (None, 0.0),
        ('invalid', 0.0)
    ]
    
    for input_val, expected in test_cases:
        result = decimal_to_float(input_val)
        print(f"Input: {input_val} ({type(input_val)})")
        print(f"Expected: {expected} ({type(expected)})")
        print(f"Result: {result} ({type(result)})")
        print(f"Match: {result == expected}")
        print("---")

def test_campaign_operations():
    """Test campaign-related operations with Decimal values"""
    print("\nTesting campaign operations...")
    
    # Create a decimal value
    test_decimal = Decimal('123.45')
    test_float = 2.5
    
    # 1. Test direct multiplication (which would fail without conversion)
    try:
        # This should fail without conversion
        result = test_decimal * test_float
        print(f"Direct multiplication result: {result}")
    except TypeError as e:
        print(f"Direct multiplication error: {e}")
    
    # 2. Test with conversion
    converted = decimal_to_float(test_decimal)
    result = converted * test_float
    print(f"Multiplication after conversion: {result}")
    
    # 3. Test creating mock campaign data with conversions
    analytics_service = AnalyticsService(db.session)
    
    # Test the _decimal_to_float method in the service
    test_values = [Decimal('123.45'), 456.78, None, 'invalid']
    for val in test_values:
        result = analytics_service._decimal_to_float(val)
        print(f"Service _decimal_to_float({val}) = {result}")

if __name__ == "__main__":
    print("Analytics Service Decimal Handling Test")
    print("======================================")
    
    # Run tests
    test_decimal_to_float()
    test_campaign_operations()
    
    print("\nTests completed.") 
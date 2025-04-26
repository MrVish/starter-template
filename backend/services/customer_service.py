from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
from sqlalchemy import func, desc
from extensions import db
from models import (
    DimCustomer,
    DimCustomerAIFeatures,
    DimContactPreferences,
    FactTransaction,
    FactFeedback
)
from repositories.customer_repository import CustomerRepository

class CustomerService:
    """Service for customer-related operations"""
    
    def __init__(self):
        self.customer_repository = CustomerRepository()
    
    def get_customer_profile(self, customer_id: int) -> Dict[str, Any]:
        """Get comprehensive customer profile with all related data"""
        # Get customer with AI features and contact preferences
        customer_data = self.customer_repository.get_customer_with_profile(customer_id)
        if not customer_data:
            return None
            
        # Get recent transactions
        transactions = self.customer_repository.get_customer_transactions(customer_id, limit=5)
        customer_data['recent_transactions'] = transactions
        
        # Get feedback
        feedback = self.customer_repository.get_customer_feedback(customer_id)
        customer_data['feedback'] = feedback
        
        # Calculate additional metrics
        if transactions:
            # Calculate average transaction amount
            total_amount = sum(tx['txn_amount'] for tx in transactions)
            customer_data['avg_transaction_amount'] = total_amount / len(transactions)
            
            # Calculate days since last transaction
            last_transaction_date = max(tx['txn_date'] for tx in transactions if tx['txn_date'])
            days_since = (datetime.now().date() - datetime.fromisoformat(last_transaction_date).date()).days
            customer_data['days_since_last_transaction'] = days_since
        
        return customer_data
    
    def get_customer_transaction_history(self, customer_id: int, page=1, per_page=20) -> Dict[str, Any]:
        """Get paginated transaction history for a customer"""
        # Check if customer exists
        customer = self.customer_repository.get_by_id(customer_id)
        if not customer:
            return None
            
        # Get paginated transaction history
        query = FactTransaction.query.filter_by(customer_id=customer_id).order_by(desc(FactTransaction.txn_date))
        total = query.count()
        transactions = query.paginate(page=page, per_page=per_page, error_out=False)
        
        return {
            'customer': customer.to_dict(),
            'transactions': [tx.to_dict() for tx in transactions.items],
            'total': total,
            'page': page,
            'per_page': per_page,
            'pages': (total // per_page) + (1 if total % per_page > 0 else 0)
        }
    
    def get_high_value_customers(self, limit=10) -> List[Dict[str, Any]]:
        """Get high-value customers based on AI model prediction"""
        return self.customer_repository.get_high_value_customers(limit=limit)
    
    def get_customers_at_risk(self, threshold=0.7, limit=10) -> List[Dict[str, Any]]:
        """Get customers with high churn risk"""
        return self.customer_repository.get_customers_at_risk(threshold=threshold, limit=limit)
    
    def update_customer_contact_preferences(self, customer_id: int, preferences: Dict[str, Any]) -> Dict[str, Any]:
        """Update a customer's contact preferences"""
        # Check if customer exists
        customer = self.customer_repository.get_by_id(customer_id)
        if not customer:
            return None
            
        # Get or create contact preferences
        contact_prefs = customer.contact_preferences
        if not contact_prefs:
            from models import DimContactPreferences
            contact_prefs = DimContactPreferences(customer_id=customer_id)
            db.session.add(contact_prefs)
        
        # Update fields
        for key, value in preferences.items():
            if hasattr(contact_prefs, key):
                setattr(contact_prefs, key, value)
        
        db.session.commit()
        return contact_prefs.to_dict()
    
    def record_customer_feedback(self, customer_id: int, feedback_data: Dict[str, Any]) -> Dict[str, Any]:
        """Record customer feedback"""
        # Check if customer exists
        customer = self.customer_repository.get_by_id(customer_id)
        if not customer:
            return None
            
        # Create feedback record
        feedback = FactFeedback(
            customer_id=customer_id,
            campaign_id=feedback_data.get('campaign_id'),
            rating=feedback_data.get('rating'),
            comments=feedback_data.get('comments'),
            submitted_at=datetime.now()
        )
        
        db.session.add(feedback)
        db.session.commit()
        
        return feedback.to_dict() 
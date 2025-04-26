from typing import List, Dict, Any, Optional
from sqlalchemy import func, desc, case
from .base_repository import BaseRepository
from models import (
    DimCustomer, 
    DimCustomerAIFeatures, 
    DimContactPreferences,
    FactFeedback,
    FactTransaction
)

class CustomerRepository(BaseRepository[DimCustomer]):
    """Repository for customer operations"""
    
    def __init__(self):
        super().__init__(DimCustomer)
    
    def get_customer_with_profile(self, customer_id: int) -> Dict[str, Any]:
        """Get customer with AI features and contact preferences"""
        customer = self.get_by_id(customer_id)
        if not customer:
            return None
            
        customer_dict = customer.to_dict()
        
        # Add AI features if available
        if customer.ai_features:
            customer_dict.update({
                'ai_features': customer.ai_features.to_dict()
            })
            
        # Add contact preferences if available
        if customer.contact_preferences:
            customer_dict.update({
                'contact_preferences': customer.contact_preferences.to_dict()
            })
            
        return customer_dict
    
    def get_high_value_customers(self, limit=10) -> List[Dict[str, Any]]:
        """Get top high-value customers based on LTV score"""
        results = (
            DimCustomer.query
            .join(DimCustomerAIFeatures, DimCustomerAIFeatures.customer_id == DimCustomer.id)
            .order_by(desc(DimCustomerAIFeatures.lifetime_value_score))
            .limit(limit)
            .all()
        )
        
        return [self.get_customer_with_profile(customer.id) for customer in results]
    
    def get_customers_at_risk(self, threshold=0.7, limit=10) -> List[Dict[str, Any]]:
        """Get customers with high churn risk"""
        results = (
            DimCustomer.query
            .join(DimCustomerAIFeatures, DimCustomerAIFeatures.customer_id == DimCustomer.id)
            .filter(DimCustomerAIFeatures.churn_risk_score >= threshold)
            .order_by(desc(DimCustomerAIFeatures.churn_risk_score))
            .limit(limit)
            .all()
        )
        
        return [self.get_customer_with_profile(customer.id) for customer in results]
    
    def get_customer_feedback(self, customer_id: int) -> List[Dict[str, Any]]:
        """Get all feedback submitted by a customer"""
        feedback = FactFeedback.query.filter_by(customer_id=customer_id).order_by(desc(FactFeedback.submitted_at)).all()
        return [item.to_dict() for item in feedback]
    
    def get_customer_transactions(self, customer_id: int, limit=20) -> List[Dict[str, Any]]:
        """Get recent transactions for a customer"""
        transactions = FactTransaction.query.filter_by(customer_id=customer_id).order_by(desc(FactTransaction.txn_date)).limit(limit).all()
        return [tx.to_dict() for tx in transactions]
    
    def get_customer_segment_distribution(self) -> List[Dict[str, Any]]:
        """Get distribution of customers across segments"""
        from models import DimSegment
        
        results = (
            DimCustomer.query
            .with_entities(
                DimSegment.id, 
                DimSegment.name, 
                func.count(DimCustomer.id).label('customer_count')
            )
            .join(DimSegment, DimSegment.id == DimCustomer.latest_segment_id)
            .group_by(DimSegment.id, DimSegment.name)
            .order_by(desc('customer_count'))
            .all()
        )
        
        return [{
            'segment_id': segment_id,
            'segment_name': segment_name,
            'customer_count': count
        } for segment_id, segment_name, count in results] 
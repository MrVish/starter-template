from datetime import datetime
from extensions import db

class DimCustomerAIFeatures(db.Model):
    """Dimension table for customer AI-generated features"""
    __tablename__ = 'dim_customer_ai_features'
    
    customer_id = db.Column(db.BigInteger, db.ForeignKey('dim_customers.id'), primary_key=True)
    churn_risk_score = db.Column(db.DECIMAL(5, 2))  # 0-100 score
    lifetime_value_score = db.Column(db.DECIMAL(10, 2))
    propensity_score = db.Column(db.DECIMAL(5, 2))  # 0-100 score
    model_version = db.Column(db.String(50))
    scored_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<DimCustomerAIFeatures for customer_id={self.customer_id}>'
        
    def to_dict(self):
        return {
            'customer_id': self.customer_id,
            'churn_risk_score': float(self.churn_risk_score) if self.churn_risk_score else None,
            'lifetime_value_score': float(self.lifetime_value_score) if self.lifetime_value_score else None,
            'propensity_score': float(self.propensity_score) if self.propensity_score else None,
            'model_version': self.model_version,
            'scored_at': self.scored_at.isoformat() if self.scored_at else None
        } 
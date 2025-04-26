from datetime import datetime
from extensions import db

class FactFeedback(db.Model):
    """Fact table for customer feedback"""
    __tablename__ = 'fact_feedback'
    
    id = db.Column(db.BigInteger, primary_key=True)
    customer_id = db.Column(db.BigInteger, db.ForeignKey('dim_customers.id'), nullable=False)
    campaign_id = db.Column(db.BigInteger, db.ForeignKey('dim_campaigns.id'))
    rating = db.Column(db.SmallInteger)  # 1-5 scale
    comments = db.Column(db.Text)
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    campaign = db.relationship('DimCampaign', backref='feedback')
    
    def __repr__(self):
        return f'<FactFeedback id={self.id}, customer_id={self.customer_id}, rating={self.rating}>'
        
    def to_dict(self):
        return {
            'id': self.id,
            'customer_id': self.customer_id,
            'campaign_id': self.campaign_id,
            'rating': self.rating,
            'comments': self.comments,
            'submitted_at': self.submitted_at.isoformat() if self.submitted_at else None
        } 
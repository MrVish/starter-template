from datetime import datetime
from extensions import db

class StgFeedbackScore(db.Model):
    """Staging table for customer feedback scores"""
    __tablename__ = 'stg_feedback_scores'
    __table_args__ = {'extend_existing': True}
    
    id = db.Column(db.BigInteger, primary_key=True)
    customer_id = db.Column(db.String(50), nullable=False, index=True)
    campaign_id = db.Column(db.String(50), index=True)
    rating = db.Column(db.Integer)  # Score from 1-5
    comments = db.Column(db.Text)
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<StgFeedbackScore id={self.id}, rating={self.rating}>'
        
    def to_dict(self):
        return {
            'id': self.id,
            'customer_id': self.customer_id,
            'campaign_id': self.campaign_id,
            'rating': self.rating,
            'comments': self.comments,
            'submitted_at': self.submitted_at.isoformat() if self.submitted_at else None
        } 
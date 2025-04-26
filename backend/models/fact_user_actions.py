from datetime import datetime
from extensions import db

class FactUserAction(db.Model):
    """Fact table for user action logs (audit trail)"""
    __tablename__ = 'fact_user_actions'
    __table_args__ = {'extend_existing': True}
    
    id = db.Column(db.BigInteger, primary_key=True)
    user_id = db.Column(db.BigInteger, db.ForeignKey('users.id'), nullable=False)
    action_type = db.Column(db.String(100), nullable=False)  # e.g., edit_campaign, view_report
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    details = db.Column(db.Text)  # Additional details about the action (JSON)
    
    # Relationship
    user = db.relationship('DimUser', backref='actions')
    
    def __repr__(self):
        return f'<FactUserAction id={self.id}, user_id={self.user_id}, action={self.action_type}>'
        
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'action_type': self.action_type,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None,
            'details': self.details
        } 
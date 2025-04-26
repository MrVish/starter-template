from datetime import datetime
from extensions import db

class DimCustomer(db.Model):
    """Dimension table for customers"""
    __tablename__ = 'dim_customers'
    
    id = db.Column(db.BigInteger, primary_key=True)
    full_name = db.Column(db.String(255))
    email = db.Column(db.String(255))
    dob = db.Column(db.Date)
    gender = db.Column(db.String(10))
    income_bracket = db.Column(db.String(50))
    risk_profile = db.Column(db.String(50))
    location = db.Column(db.String(100))
    joined_date = db.Column(db.Date)
    active_product_count = db.Column(db.Integer, default=0)
    latest_segment_id = db.Column(db.BigInteger, db.ForeignKey('dim_segments.id'))
    
    # Relationships
    segment = db.relationship('DimSegment', backref='customers')
    transactions = db.relationship('FactTransaction', backref='customer')
    ai_features = db.relationship('DimCustomerAIFeatures', backref='customer', uselist=False)
    feedback = db.relationship('FactFeedback', backref='customer')
    contact_preferences = db.relationship('DimContactPreferences', backref='customer', uselist=False)
    
    def __repr__(self):
        return f'<DimCustomer {self.full_name}>'
        
    def to_dict(self):
        return {
            'id': self.id,
            'full_name': self.full_name,
            'email': self.email,
            'gender': self.gender,
            'income_bracket': self.income_bracket,
            'risk_profile': self.risk_profile,
            'location': self.location,
            'joined_date': self.joined_date.isoformat() if self.joined_date else None,
            'active_product_count': self.active_product_count,
            'segment_id': self.latest_segment_id
        } 
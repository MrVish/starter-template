from datetime import datetime
from extensions import db

class DimCustomer(db.Model):
    """Dimension table for customer data"""
    __tablename__ = 'dim_customers'
    
    id = db.Column(db.BigInteger, primary_key=True)
    full_name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    dob = db.Column(db.Date)
    gender = db.Column(db.String(20))
    income_bracket = db.Column(db.String(50))  # Low, Medium, High, Very High
    risk_profile = db.Column(db.String(50))  # Conservative, Moderate, Aggressive
    location = db.Column(db.String(255))
    joined_date = db.Column(db.Date, default=datetime.now)
    active_product_count = db.Column(db.Integer, default=0)
    latest_segment_id = db.Column(db.BigInteger, db.ForeignKey('dim_segments.id'))
    
    # Relationships
    segment = db.relationship('DimSegment', backref='customers')
    contact_preferences = db.relationship('DimContactPreferences', backref='customer', uselist=False)
    ai_features = db.relationship('DimCustomerAIFeatures', backref='customer', uselist=False)
    transactions_main = db.relationship('FactTransactionMain', 
                                   backref='customer', 
                                   foreign_keys='FactTransactionMain.customer_key')
    
    def __repr__(self):
        return f'<DimCustomer {self.full_name}>'
        
    def to_dict(self):
        return {
            'id': self.id,
            'full_name': self.full_name,
            'email': self.email,
            'dob': self.dob.isoformat() if self.dob else None,
            'gender': self.gender,
            'income_bracket': self.income_bracket,
            'risk_profile': self.risk_profile,
            'location': self.location,
            'joined_date': self.joined_date.isoformat() if self.joined_date else None,
            'active_product_count': self.active_product_count,
            'latest_segment_id': self.latest_segment_id
        } 
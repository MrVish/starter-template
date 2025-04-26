from extensions import db

class StgCustomerProfile(db.Model):
    """Staging table for customer profiles from source systems"""
    __tablename__ = 'stg_customer_profile'
    __table_args__ = {'extend_existing': True}
    
    id = db.Column(db.BigInteger, primary_key=True)
    customer_id = db.Column(db.String(50), nullable=False, index=True)
    full_name = db.Column(db.String(255))
    email = db.Column(db.String(255))
    mobile = db.Column(db.String(20))
    dob = db.Column(db.Date)
    gender = db.Column(db.String(10))
    income_bracket = db.Column(db.String(50))
    marital_status = db.Column(db.String(20))
    occupation = db.Column(db.String(100))
    location = db.Column(db.String(100))
    risk_profile = db.Column(db.String(50))
    joined_date = db.Column(db.Date)
    segment_tag = db.Column(db.String(50))
    
    def __repr__(self):
        return f'<StgCustomerProfile {self.customer_id} - {self.full_name}>'
        
    def to_dict(self):
        return {
            'id': self.id,
            'customer_id': self.customer_id,
            'full_name': self.full_name,
            'email': self.email,
            'mobile': self.mobile,
            'dob': self.dob.isoformat() if self.dob else None,
            'gender': self.gender,
            'income_bracket': self.income_bracket,
            'marital_status': self.marital_status,
            'occupation': self.occupation,
            'location': self.location,
            'risk_profile': self.risk_profile,
            'joined_date': self.joined_date.isoformat() if self.joined_date else None,
            'segment_tag': self.segment_tag
        } 
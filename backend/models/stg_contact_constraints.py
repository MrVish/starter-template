from extensions import db

class StgContactConstraint(db.Model):
    """Staging table for customer contact preferences and constraints"""
    __tablename__ = 'stg_contact_constraints'
    __table_args__ = {'extend_existing': True}
    
    id = db.Column(db.BigInteger, primary_key=True)
    customer_id = db.Column(db.String(50), nullable=False, index=True, unique=True)
    do_not_email = db.Column(db.Boolean, default=False)
    do_not_sms = db.Column(db.Boolean, default=False)
    preferred_contact_time = db.Column(db.String(50))  # e.g., "9AM - 11AM"
    
    def __repr__(self):
        return f'<StgContactConstraint customer_id={self.customer_id}>'
        
    def to_dict(self):
        return {
            'id': self.id,
            'customer_id': self.customer_id,
            'do_not_email': self.do_not_email,
            'do_not_sms': self.do_not_sms,
            'preferred_contact_time': self.preferred_contact_time
        }
        
    def can_contact_via(self, channel):
        """Check if customer can be contacted via a specific channel"""
        if channel.lower() == 'email':
            return not self.do_not_email
        elif channel.lower() == 'sms':
            return not self.do_not_sms
        return True 
from extensions import db

class DimContactPreferences(db.Model):
    """Dimension table for customer contact preferences"""
    __tablename__ = 'dim_contact_preferences'
    
    customer_id = db.Column(db.BigInteger, db.ForeignKey('dim_customers.id'), primary_key=True)
    do_not_email = db.Column(db.Boolean, default=False)
    do_not_sms = db.Column(db.Boolean, default=False)
    preferred_contact_time = db.Column(db.String(50))  # e.g., "morning", "evening"
    
    def __repr__(self):
        return f'<DimContactPreferences for customer_id={self.customer_id}>'
        
    def to_dict(self):
        return {
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
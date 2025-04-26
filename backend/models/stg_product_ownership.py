from extensions import db

class StgProductOwnership(db.Model):
    """Staging table for customer product ownership"""
    __tablename__ = 'stg_product_ownership'
    __table_args__ = {'extend_existing': True}
    
    id = db.Column(db.BigInteger, primary_key=True)
    customer_id = db.Column(db.String(50), nullable=False, index=True)
    product_code = db.Column(db.String(50), nullable=False)  # e.g. CC_PLATINUM, SAVINGS_ACCOUNT
    active = db.Column(db.Boolean, default=True)
    opened_date = db.Column(db.Date)
    closed_date = db.Column(db.Date)
    
    def __repr__(self):
        return f'<StgProductOwnership customer_id={self.customer_id}, product={self.product_code}>'
        
    def to_dict(self):
        return {
            'id': self.id,
            'customer_id': self.customer_id,
            'product_code': self.product_code,
            'active': self.active,
            'opened_date': self.opened_date.isoformat() if self.opened_date else None,
            'closed_date': self.closed_date.isoformat() if self.closed_date else None
        } 
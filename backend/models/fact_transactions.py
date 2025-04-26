from datetime import datetime
from extensions import db

class FactTransaction(db.Model):
    """Fact table for financial transactions"""
    __tablename__ = 'fact_transactions'
    
    id = db.Column(db.BigInteger, primary_key=True)
    customer_id = db.Column(db.BigInteger, db.ForeignKey('dim_customers.id'), nullable=False)
    txn_date = db.Column(db.Date, nullable=False)
    product_code = db.Column(db.String(50))  # e.g., CC_PLATINUM, SAVINGS_ACCOUNT
    txn_amount = db.Column(db.DECIMAL(12, 2))
    txn_type = db.Column(db.String(50))  # Debit/Credit
    campaign_id = db.Column(db.BigInteger, db.ForeignKey('dim_campaigns.id'))
    channel_id = db.Column(db.BigInteger, db.ForeignKey('dim_channels.id'))
    
    # Relationships
    campaign = db.relationship('DimCampaign', backref='transactions')
    channel = db.relationship('DimChannel', backref='transactions')
    
    def __repr__(self):
        return f'<FactTransaction id={self.id}, amount={self.txn_amount}>'
        
    def to_dict(self):
        return {
            'id': self.id,
            'customer_id': self.customer_id,
            'txn_date': self.txn_date.isoformat() if self.txn_date else None,
            'product_code': self.product_code,
            'txn_amount': float(self.txn_amount) if self.txn_amount else 0,
            'txn_type': self.txn_type,
            'campaign_id': self.campaign_id,
            'channel_id': self.channel_id
        } 
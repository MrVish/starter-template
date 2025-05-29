"""
Product dimension model for data warehouse star schema
"""
from extensions import db
from datetime import datetime

class DimProduct(db.Model):
    """
    Dimension table for product data.
    Represents financial products like savings accounts, loans, credit cards, etc.
    """
    __tablename__ = 'dim_products'
    
    product_key = db.Column(db.Integer, primary_key=True, autoincrement=True)
    product_hk = db.Column(db.String(32), nullable=False)
    account_number = db.Column(db.String(50), nullable=True)
    product_type = db.Column(db.String(30), nullable=False)
    credit_limit = db.Column(db.Numeric(18, 2), nullable=True)
    principal_amt = db.Column(db.Numeric(18, 2), nullable=True)
    interest_rate_pct = db.Column(db.Numeric(5, 2), nullable=True)
    status = db.Column(db.String(20), nullable=True)
    reward_program = db.Column(db.String(50), nullable=True)
    tenure_months = db.Column(db.Integer, nullable=True)
    property_type = db.Column(db.String(50), nullable=True)
    last_updated_dts = db.Column(db.DateTime, default=datetime.now)
    
    # Relationships with fact tables using the product dimension
    transactions_main = db.relationship('FactTransactionMain',
                                    backref='product',
                                    primaryjoin="DimProduct.product_key == FactTransactionMain.product_key",
                                    foreign_keys="FactTransactionMain.product_key")
    
    def __repr__(self):
        return f'<DimProduct {self.account_number}>'
        
    def to_dict(self):
        return {
            'product_key': self.product_key,
            'product_hk': self.product_hk,
            'account_number': self.account_number,
            'product_type': self.product_type,
            'credit_limit': float(self.credit_limit) if self.credit_limit else None,
            'principal_amt': float(self.principal_amt) if self.principal_amt else None,
            'interest_rate_pct': float(self.interest_rate_pct) if self.interest_rate_pct else None,
            'status': self.status,
            'reward_program': self.reward_program,
            'tenure_months': self.tenure_months,
            'property_type': self.property_type
        } 
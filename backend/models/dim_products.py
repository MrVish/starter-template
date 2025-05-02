"""
Product dimension model for data warehouse star schema
"""
from extensions import db

class DimProduct(db.Model):
    """Product dimension model representing products across all product types"""
    __tablename__ = "dim_products"

    product_key = db.Column(db.Integer, primary_key=True)
    product_hk = db.Column(db.String(32), unique=True, nullable=False)
    account_number = db.Column(db.String(50))
    product_type = db.Column(db.String(30))          # CREDIT_CARD / HOME_LOAN ...
    credit_limit = db.Column(db.Numeric(18, 2))
    principal_amt = db.Column(db.Numeric(18, 2))
    interest_rate_pct = db.Column(db.Numeric(5, 2))
    status = db.Column(db.String(20))
    reward_program = db.Column(db.String(50))
    tenure_months = db.Column(db.Integer)
    property_type = db.Column(db.String(50))
    last_updated_dts = db.Column(db.DateTime(timezone=True))
    
    # Relationships
    transactions = db.relationship('FactTransaction', backref='product')
    
    def __repr__(self):
        return f'<DimProduct {self.product_type} - {self.account_number}>' 
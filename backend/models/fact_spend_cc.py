"""
Credit Card Spend fact model for data warehouse star schema
"""
from extensions import db

class FactSpendCC(db.Model):
    """Credit Card Spend fact model for card-spend analytics and rewards"""
    __tablename__ = "fact_spend_cc"

    spend_txn_key = db.Column(db.Integer, primary_key=True)
    txn_hk = db.Column(db.String(32), unique=True, nullable=False)
    
    # Foreign keys to dimension tables
    customer_key = db.Column(db.Integer, db.ForeignKey("dim_customers.id"), nullable=False)
    product_key = db.Column(db.Integer, db.ForeignKey("dim_products.product_key"), nullable=False)
    date_key = db.Column(db.Integer, db.ForeignKey("dim_dates.id"), nullable=False)
    merchant_key = db.Column(db.Integer, db.ForeignKey("dim_merchants.id"), nullable=True)
    
    # Transaction attributes
    txn_amount = db.Column(db.Numeric(18, 2))
    txn_currency = db.Column(db.String(3))
    rewards_earned = db.Column(db.Numeric(18, 2))
    interest_charged = db.Column(db.Numeric(18, 2))
    credit_limit = db.Column(db.Numeric(18, 2))
    available_credit = db.Column(db.Numeric(18, 2))
    reward_program = db.Column(db.String(50))
    txn_timestamp = db.Column(db.DateTime(timezone=True))
    load_dts = db.Column(db.DateTime(timezone=True))
    
    def __repr__(self):
        return f'<FactSpendCC {self.txn_amount}>' 
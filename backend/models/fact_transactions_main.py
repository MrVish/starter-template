"""
Transaction fact model for data warehouse star schema
"""
from extensions import db

class FactTransaction(db.Model):
    """Transaction fact model representing all financial transactions"""
    __tablename__ = "fact_transactions"

    transaction_key = db.Column(db.Integer, primary_key=True)
    txn_hk = db.Column(db.String(32), unique=True, nullable=False)
    
    # Foreign keys to dimension tables
    customer_key = db.Column(db.Integer, db.ForeignKey("dim_customers.id"), nullable=False)
    product_key = db.Column(db.Integer, db.ForeignKey("dim_products.product_key"), nullable=False)
    date_key = db.Column(db.Integer, db.ForeignKey("dim_dates.id"), nullable=False)
    branch_key = db.Column(db.Integer, db.ForeignKey("dim_branches.branch_key"), nullable=True)
    
    # Transaction attributes
    txn_type = db.Column(db.String(30))
    txn_amount = db.Column(db.Numeric(18, 2))
    txn_currency = db.Column(db.String(3))
    merchant_category = db.Column(db.String(50))
    txn_timestamp = db.Column(db.DateTime(timezone=True))
    load_dts = db.Column(db.DateTime(timezone=True))
    
    def __repr__(self):
        return f'<FactTransaction {self.txn_type} - {self.txn_amount}>' 
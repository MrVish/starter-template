from extensions import db

class StgTransaction(db.Model):
    """Staging table for financial transactions"""
    __tablename__ = 'stg_transactions'
    __table_args__ = {'extend_existing': True}
    
    txn_id = db.Column(db.String(50), primary_key=True)
    customer_id = db.Column(db.String(50), nullable=False, index=True)
    product = db.Column(db.String(100))  # Credit Card, Home Loan, Deposit
    txn_amount = db.Column(db.DECIMAL(12, 2))
    txn_type = db.Column(db.String(50))  # Credit, Debit, EMI, Payment
    txn_date = db.Column(db.Date)
    location = db.Column(db.String(100))
    
    def __repr__(self):
        return f'<StgTransaction txn_id={self.txn_id}, amount={self.txn_amount}>'
        
    def to_dict(self):
        return {
            'txn_id': self.txn_id,
            'customer_id': self.customer_id,
            'product': self.product,
            'txn_amount': float(self.txn_amount) if self.txn_amount else 0,
            'txn_type': self.txn_type,
            'txn_date': self.txn_date.isoformat() if self.txn_date else None,
            'location': self.location
        } 
"""
Credit Card Spend fact model for data warehouse star schema
"""
from sqlalchemy import Column, Integer, String, Numeric, DateTime, ForeignKey, CHAR
from sqlalchemy.sql.sqltypes import TIMESTAMP
from app.db.base_class import Base


class FactSpendCC(Base):
    """Credit Card Spend fact model for card-spend analytics and rewards"""
    __tablename__ = "fact_spend_cc"

    spend_txn_key = Column(Integer, primary_key=True)
    txn_hk = Column(CHAR(32), unique=True, nullable=False)
    
    # Foreign keys to dimension tables
    customer_key = Column(Integer, ForeignKey("dim_customers.customer_key"), nullable=False)
    product_key = Column(Integer, ForeignKey("dim_products.product_key"), nullable=False)
    date_key = Column(Integer, ForeignKey("dim_dates.date_key"), nullable=False)
    merchant_key = Column(Integer, ForeignKey("dim_merchants.merchant_key"), nullable=True)
    
    # Transaction attributes
    txn_amount = Column(Numeric(18, 2))
    txn_currency = Column(String(3))
    rewards_earned = Column(Numeric(18, 2))
    interest_charged = Column(Numeric(18, 2))
    credit_limit = Column(Numeric(18, 2))
    available_credit = Column(Numeric(18, 2))
    reward_program = Column(String(50))
    txn_timestamp = Column(DateTime(timezone=True))
    load_dts = Column(DateTime(timezone=True)) 
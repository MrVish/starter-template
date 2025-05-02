"""
Customer Channel Activity fact model for data warehouse star schema
"""
from sqlalchemy import Column, Integer, String, Numeric, DateTime, ForeignKey, CHAR
from sqlalchemy.sql.sqltypes import TIMESTAMP
from app.db.base_class import Base


class FactCustomerChannelActivity(Base):
    """Customer Channel Activity fact model for tracking multi-channel engagement metrics"""
    __tablename__ = "fact_customer_channel_activity"

    activity_key = Column(Integer, primary_key=True)
    
    # Foreign keys to dimension tables
    customer_key = Column(Integer, ForeignKey("dim_customers.customer_key"), nullable=False)
    date_key = Column(Integer, ForeignKey("dim_dates.date_key"), nullable=False)
    channel_key = Column(Integer, ForeignKey("dim_channels.channel_key"), nullable=False)
    
    # Activity metrics
    opens = Column(Integer, default=0)
    clicks = Column(Integer, default=0)
    logins = Column(Integer, default=0)
    session_count = Column(Integer, default=0)
    session_duration_seconds = Column(Integer)
    conversion_count = Column(Integer, default=0)
    bounce_count = Column(Integer, default=0)
    activity_date = Column(DateTime(timezone=True))
    load_dts = Column(DateTime(timezone=True))
    
    # Composite unique constraint
    __table_args__ = (
        {'sqlite_autoincrement': True},
    ) 
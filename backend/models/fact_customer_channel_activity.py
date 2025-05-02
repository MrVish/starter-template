"""
Customer Channel Activity fact model for data warehouse star schema
"""
from extensions import db

class FactCustomerChannelActivity(db.Model):
    """Customer Channel Activity fact model for tracking multi-channel engagement metrics"""
    __tablename__ = "fact_customer_channel_activity"

    activity_key = db.Column(db.Integer, primary_key=True)
    
    # Foreign keys to dimension tables
    customer_key = db.Column(db.Integer, db.ForeignKey("dim_customers.id"), nullable=False)
    date_key = db.Column(db.Integer, db.ForeignKey("dim_dates.id"), nullable=False)
    channel_key = db.Column(db.Integer, db.ForeignKey("dim_channels.id"), nullable=False)
    
    # Activity metrics
    opens = db.Column(db.Integer, default=0)
    clicks = db.Column(db.Integer, default=0)
    logins = db.Column(db.Integer, default=0)
    session_count = db.Column(db.Integer, default=0)
    session_duration_seconds = db.Column(db.Integer)
    conversion_count = db.Column(db.Integer, default=0)
    bounce_count = db.Column(db.Integer, default=0)
    activity_date = db.Column(db.DateTime(timezone=True))
    load_dts = db.Column(db.DateTime(timezone=True))
    
    def __repr__(self):
        return f'<FactCustomerChannelActivity {self.customer_key} - {self.channel_key}>'
    
    __table_args__ = (
        {"sqlite_autoincrement": True},
    ) 
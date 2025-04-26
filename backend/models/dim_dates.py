from extensions import db

class DimDate(db.Model):
    """Dimension table for dates"""
    __tablename__ = 'dim_dates'
    __table_args__ = {'extend_existing': True}
    
    id = db.Column(db.Integer, primary_key=True)  # YYYYMMDD format
    date = db.Column(db.Date, nullable=False, unique=True)
    is_weekend = db.Column(db.Boolean, default=False)
    
    def __repr__(self):
        return f'<DimDate {self.date}>'
        
    def to_dict(self):
        return {
            'id': self.id,
            'date': self.date.isoformat() if self.date else None,
            'is_weekend': self.is_weekend
        }
        
    @classmethod
    def create_from_date(cls, date, session=None):
        """Create a date dimension record from a Python date object"""
        from datetime import datetime
        
        # Convert to YYYYMMDD format
        date_key = int(date.strftime('%Y%m%d'))
        
        # Check if record exists
        if session:
            existing = session.query(cls).filter_by(id=date_key).first()
            if existing:
                return existing
        
        # Create new record
        weekday = date.weekday()
        is_weekend = weekday >= 5  # 5 = Saturday, 6 = Sunday
        
        new_date = cls(
            id=date_key,
            date=date,
            is_weekend=is_weekend
        )
        
        if session:
            session.add(new_date)
            session.commit()
            
        return new_date 
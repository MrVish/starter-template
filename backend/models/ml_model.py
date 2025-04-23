"""
[DEPRECATED - CANDIDATE FOR REMOVAL]
This file contains the ML model database schema that may no longer be needed.
If you're not using model risk management features, this file can be safely removed.
"""
from datetime import datetime
from extensions import db

# User-Model association table
model_users = db.Table('model_users',
    db.Column('model_id', db.Integer, db.ForeignKey('ml_models.id'), primary_key=True),
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True)
)

class MLModel(db.Model):
    """Model for tracking machine learning models"""
    __tablename__ = 'ml_models'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    model_type = db.Column(db.String(50), nullable=False)  # classification, regression, etc.
    status = db.Column(db.String(20), default='created')  # created, training, trained, failed, archived
    
    # Model details
    version = db.Column(db.String(20), default='1.0.0')
    path = db.Column(db.String(255))  # Path to the stored model
    metrics = db.Column(db.Text)  # JSON string of model metrics
    parameters = db.Column(db.Text)  # JSON string of model parameters
    
    # Data details
    dataset_path = db.Column(db.String(255))
    feature_columns = db.Column(db.Text)  # JSON string of feature column names
    target_column = db.Column(db.String(100))
    
    # Drift detection
    drift_detected = db.Column(db.Boolean, default=False)
    last_drift_check = db.Column(db.DateTime)
    
    # Timestamps and metadata
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_by_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    error = db.Column(db.Text)  # Error message if model failed
    
    # Relationships
    created_by = db.relationship('User', backref='created_models', foreign_keys=[created_by_id])
    users = db.relationship('User', secondary=model_users, backref=db.backref('models', lazy='dynamic'))
    
    def __repr__(self):
        return f'<MLModel {self.name} v{self.version}>'
    
    @property
    def is_active(self):
        return self.status == 'trained' and not self.drift_detected 
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS

db = SQLAlchemy()
jwt = JWTManager()
cors = CORS()

def init_extensions(app):
    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(app)
    
    # Configure JWT
    app.config['JWT_SECRET_KEY'] = app.config.get('SECRET_KEY', 'your-secret-key')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 900  # 15 minutes
    app.config['JWT_REFRESH_TOKEN_EXPIRES'] = 604800  # 7 days
    
    # Create tables
    with app.app_context():
        db.create_all() 
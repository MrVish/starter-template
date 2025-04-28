# FastAPI Backend

A modern FastAPI backend with SQLAlchemy, JWT authentication, and more.

## Features

- FastAPI framework with automatic API documentation
- SQLAlchemy ORM with PostgreSQL support
- JWT authentication
- User management with superuser support
- Item management with ownership
- CORS support
- Environment variable configuration
- Database migrations with Alembic

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
```

2. Activate the virtual environment:
- Windows:
```bash
.\venv\Scripts\activate
```
- Linux/Mac:
```bash
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file in the backend directory with the following variables:
```env
POSTGRES_SERVER=localhost
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=app
POSTGRES_PORT=5432
```

5. Initialize the database:
```bash
alembic upgrade head
```

## Running the Application

1. Start the development server:
```bash
uvicorn app.main:app --reload
```

2. Access the API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

### Authentication
- POST /api/v1/auth/login - Login and get access token
- POST /api/v1/auth/register - Register new user

### Users
- GET /api/v1/users/me - Get current user
- PUT /api/v1/users/me - Update current user
- GET /api/v1/users - Get all users (superuser only)

### Items
- POST /api/v1/items - Create new item
- GET /api/v1/items - Get all items
- PUT /api/v1/items/{item_id} - Update item
- DELETE /api/v1/items/{item_id} - Delete item

## Development

### Database Migrations

1. Create a new migration:
```bash
alembic revision --autogenerate -m "description of changes"
```

2. Apply migrations:
```bash
alembic upgrade head
```

3. Rollback migrations:
```bash
alembic downgrade -1
``` 
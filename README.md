# AI Risk Management Platform

A comprehensive platform for managing AI risks, models, and data with a modern web interface.

## Features

- Dashboard with key metrics and insights
- Model management and monitoring
- Data exploration and management
- Risk assessment and monitoring
- User authentication and role-based access control
- Modern UI with responsive design

## Prerequisites

- Node.js (v18 or higher)
- Python (v3.9 or higher)
- Docker and Docker Compose
- PostgreSQL (if running locally)

## Local Development Setup

### Backend Setup

1. Create and activate a virtual environment:
```bash
# Windows
python -m venv venv
.\venv\Scripts\activate

# Linux/Mac
python -m venv venv
source venv/bin/activate
```

2. Install Python dependencies:
```bash
cd backend
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
# Create .env file in backend directory
cp .env.example .env
# Edit .env with your configuration
```

4. Initialize the database:
```bash
flask db upgrade
python utils/init_roles_and_permissions.py
python utils/create_admin.py
```

5. Run the backend server:
```bash
python app.py
```

### Frontend Setup

1. Install Node.js dependencies:
```bash
cd frontend
npm install
```

2. Set up environment variables:
```bash
# Create .env.local file in frontend directory
cp .env.example .env.local
# Edit .env.local with your configuration
```

3. Run the development server:
```bash
npm run dev
```

## Docker Setup

1. Build and start the containers:
```bash
docker-compose up --build
```

2. Initialize the database and create admin user:
```bash
docker-compose exec backend python utils/init_roles_and_permissions.py
docker-compose exec backend python utils/create_admin.py
```

3. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Default Admin Credentials

- Email: admin@example.com
- Password: admin123

## Project Structure

```
.
├── backend/                 # Flask backend
│   ├── app/                # Application code
│   ├── migrations/         # Database migrations
│   ├── utils/             # Utility scripts
│   └── requirements.txt    # Python dependencies
├── frontend/               # Next.js frontend
│   ├── src/               # Source code
│   ├── public/            # Static files
│   └── package.json       # Node.js dependencies
└── docker-compose.yml     # Docker configuration
```

## Development Workflow

1. Start the development servers:
```bash
# Terminal 1 - Backend
cd backend
python app.py

# Terminal 2 - Frontend
cd frontend
npm run dev
```

2. Make changes to the code
3. The frontend will automatically reload
4. For backend changes, the server will need to be restarted

## Production Deployment

1. Build the Docker images:
```bash
docker-compose -f docker-compose.prod.yml build
```

2. Start the production containers:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Troubleshooting

### Common Issues

1. Database connection issues:
   - Verify PostgreSQL is running
   - Check database credentials in .env files
   - Ensure migrations are up to date

2. Authentication issues:
   - Verify admin user exists
   - Check JWT secret in environment variables
   - Ensure proper CORS configuration

3. Docker issues:
   - Check if ports are available
   - Verify Docker daemon is running
   - Check container logs for errors

### Getting Help

- Check the logs:
```bash
# Backend logs
docker-compose logs backend

# Frontend logs
docker-compose logs frontend
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
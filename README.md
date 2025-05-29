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

# Recent Campaigns Testing and Fixing Scripts

This repository contains scripts for diagnosing and fixing issues with the Recent Campaigns functionality in the marketing dashboard application.

## Problem Description

The Recent Campaigns section in the dashboard may not display data correctly due to:
1. Missing columns in the database schema
2. API errors in the backend service
3. Display issues in the frontend component

## Testing Scripts

### Backend API Test Script

This script tests the backend API and database schema for the Recent Campaigns functionality.

**Usage:**
```bash
# Run diagnostic tests
python backend/scripts/test_campaign_api.py

# Run tests and attempt to fix schema issues
python backend/scripts/test_campaign_api.py --fix

# Run tests and create a test campaign if none exists
python backend/scripts/test_campaign_api.py --create
```

**What it tests:**
- Database schema for the `dim_campaigns` table
- Dashboard service functionality
- API endpoint response structure
- Campaign data fields and completeness

### Frontend API Test Script

This script tests the frontend API integration for the Recent Campaigns component.

**Usage:**
```bash
# Install node-fetch if needed
cd frontend
npm install node-fetch

# Run test script
node tests/recent-campaigns.test.js
```

**What it tests:**
- API connectivity from the frontend
- Response format and structure
- Data completeness and field validation
- Error handling

## Fix Script

If the tests identify issues with the database schema, you can run the fix script to automatically resolve them.

**Usage:**
```bash
python backend/scripts/fix_db_schema.py
```

**What it fixes:**
- Adds missing `status` and `budget` columns to the `dim_campaigns` table
- Sets default values for existing records
- Creates a test campaign if none exists
- Validates the schema after fixing

## Manual Verification

After running the fix scripts, verify the functionality by:

1. Start the application:
   ```bash
   # In PowerShell, run:
   .\start.ps1
   ```

2. Open the dashboard in your browser at http://localhost:3000/dashboard

3. Verify that the Recent Campaigns section displays data correctly

## Troubleshooting

If issues persist after running the fix scripts:

1. Check the backend logs for error messages
2. Verify database connectivity
3. Ensure the frontend API is correctly configured to use the backend URL
4. Check browser console for JavaScript errors
5. Ensure all required data fields are present in the campaign object

# Database Schema Update

## How to Update the dim_campaigns Table

Based on our analysis, the `instance/app.db` file is the correct database file being used by the application. To make the Recent Campaigns section work correctly, you need to ensure the `dim_campaigns` table has both `status` and `budget` columns.

Follow these steps to update the schema:

1. Navigate to your project directory in a terminal
2. Run Python in interactive mode:
   ```bash
   python
   ```

3. Paste these commands to update the database schema:
   ```python
   import os
   import sqlite3
   
   # Connect to the database
   db_path = "instance/app.db"
   conn = sqlite3.connect(db_path)
   cursor = conn.cursor()
   
   # Check the current schema
   cursor.execute("PRAGMA table_info(dim_campaigns)")
   columns = cursor.fetchall()
   column_names = [col[1] for col in columns]
   print(f"Current columns: {column_names}")
   
   # Add status column if it doesn't exist
   if "status" not in column_names:
       cursor.execute("ALTER TABLE dim_campaigns ADD COLUMN status TEXT DEFAULT 'active'")
       print("Added status column")
   
   # Add budget column if it doesn't exist
   if "budget" not in column_names:
       cursor.execute("ALTER TABLE dim_campaigns ADD COLUMN budget NUMERIC(12,2) DEFAULT 0")
       print("Added budget column")
   
   # Update existing rows with default values
   cursor.execute("UPDATE dim_campaigns SET status = 'active' WHERE status IS NULL")
   cursor.execute("UPDATE dim_campaigns SET budget = 5000.00 WHERE budget IS NULL")
   
   # Commit changes
   conn.commit()
   
   # Verify the changes
   cursor.execute("PRAGMA table_info(dim_campaigns)")
   updated_columns = cursor.fetchall()
   updated_column_names = [col[1] for col in updated_columns]
   print(f"Updated columns: {updated_column_names}")
   
   # Check some data
   cursor.execute("SELECT id, name, type, status, budget FROM dim_campaigns LIMIT 3")
   data = cursor.fetchall()
   print("\nSample data:")
   for row in data:
       print(row)
   
   # Close the connection
   conn.close()
   print("Database updated successfully!")
   ```

4. Exit Python interactive mode by typing `exit()`.

5. Start your application and the Recent Campaigns section should now display correctly.

## If No Campaigns Exist

If your database doesn't have any campaign data, initialize it with:

```python
# Inside Python interactive mode
conn = sqlite3.connect("instance/app.db")
cursor = conn.cursor()

# Insert some sample campaigns
sample_campaigns = [
    (1, 'Summer Sale 2023', 'Promotion', 'active', 5000.00, '2023-06-01', '2023-08-31', '2023-05-15'),
    (2, 'Back to School', 'Awareness', 'active', 3500.00, '2023-08-15', '2023-09-15', '2023-07-20'),
    (3, 'Holiday Special', 'Conversion', 'planned', 8000.00, '2023-11-15', '2023-12-31', '2023-10-01')
]

cursor.executemany("""
    INSERT OR IGNORE INTO dim_campaigns 
    (id, name, type, status, budget, start_date, end_date, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
""", sample_campaigns)

conn.commit()
print("Sample campaigns added")
conn.close()
```

## Additional Notes

- This solution maintains the existing database structure and just adds the required columns
- The database file is located at `instance/app.db`, not the root directory
- The added columns exactly match the model definition in `models/dim_campaigns.py`

# Marketing Dashboard Application

This application consists of a Flask backend and Next.js frontend for a marketing dashboard.

## Testing Campaign Data & Mock Data Features

The application provides features to test the campaign data retrieval with and without mock data. This is particularly useful for debugging database connectivity issues or testing error scenarios.

### Backend Mock Data Option

The backend service now supports disabling mock data fallback through the API:

```
GET /api/v1/dashboard/campaigns/recent?use_mock_data=false
```

Setting `use_mock_data=false` will cause the API to:
- Return real errors instead of falling back to mock data
- Show actual database errors in the response
- Help identify issues with database connections, missing tables, or empty datasets

### Frontend Testing Features

#### Development-mode Debug Options

When running in development mode, the dashboard includes:

1. **Mock Data Toggle**: In the Recent Campaigns section, you can toggle mock data on/off
2. **Refresh Button**: Manually refresh campaign data
3. **Debug Panel**: Shows detailed information about:
   - Number of campaigns loaded
   - First campaign ID
   - Current mock data setting
   - API URL being used

#### How to Use for Testing

1. Start the application in development mode
2. Navigate to the dashboard
3. Turn off mock data using the toggle in the Recent Campaigns section
4. Click the refresh button to fetch campaign data without mock fallback
5. Check the API response in your browser's developer console (F12)
6. If there are database issues, you'll see the actual error returned from the API

### Common Issues

If you see errors when mock data is disabled:

- **"dim_campaigns table does not exist"**: The database schema hasn't been created
- **"No campaigns found in database"**: The database is working but there's no campaign data
- **"Database connection error"**: The application can't connect to the database

### Running Without Mock Data in Production

In production, the API still defaults to using mock data for reliability. To test without mock data in production, you can make a direct API call:

```bash
curl "https://your-api-url/api/v1/dashboard/campaigns/recent?use_mock_data=false"
```

This will show real errors that might be hidden by the mock data fallback mechanism. 
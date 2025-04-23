# Flask Backend

## Running the Application

### Option 1: Using the convenience scripts
On Windows, use one of these scripts:
```
.\run_cli.bat    # For Command Prompt
.\run_cli.ps1    # For PowerShell
```

### Option 2: Using Flask CLI directly
```
flask --app cli_app run --debug
```

### Option 3: For production deployment
Use a WSGI server like Gunicorn with the wsgi.py entry point:
```
gunicorn wsgi:app
```

## API Routes

The API is structured with a versioned prefix: `/api/v1/`

Main routes:
- `/api/v1/admin/*` - Admin endpoints
- `/api/v1/auth/*` - Authentication endpoints
- `/api/v1/health/*` - Health and monitoring endpoints
- `/api/v1/users/*` - User management endpoints

## Code Cleanup

Some components in this codebase might not be needed for your use case:

- **Model Risk Management**: If you're not using model risk features, several components can be removed
- **Marketing Analytics**: If you're not using marketing analytics, those components can be safely removed

See `CLEANUP.md` for detailed instructions on how to identify and remove unnecessary code. 
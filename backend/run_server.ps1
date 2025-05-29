# PowerShell script to run the Flask server
# This ensures proper path setup for module imports

# Set the current directory to the script directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Run the Python server
Write-Host "Starting Flask server from $scriptPath..." -ForegroundColor Green
python -c "import os, sys; sys.path.insert(0, os.path.abspath('.')); from cli_app import app; app.run(debug=True, host='0.0.0.0', port=5000)" 
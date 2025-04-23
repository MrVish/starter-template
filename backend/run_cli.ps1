Write-Host "Running Flask CLI Application..." -ForegroundColor Green
$env:FLASK_APP = "cli_app.py"
$env:FLASK_DEBUG = "1"
flask run 
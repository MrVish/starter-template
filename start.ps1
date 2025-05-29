Write-Host "Starting backend server..."
Start-Process -FilePath "python" -ArgumentList "backend/app.py" -WindowStyle Normal

Write-Host "Starting frontend server..."
Push-Location frontend
Start-Process -FilePath "npm" -ArgumentList "run", "dev" -WindowStyle Normal
Pop-Location

Write-Host "Both servers are now running!"
Write-Host "Backend server: http://localhost:5000"
Write-Host "Frontend server: http://localhost:3000"
Write-Host "Close the command windows to stop the servers." 
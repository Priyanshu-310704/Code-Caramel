# AlgoCode Backend - Start All Services
# Run this script to start all 4 services in separate windows

Write-Host "Starting AlgoCode Backend Services..." -ForegroundColor Cyan

# Ensure Redis is running
Write-Host "Starting Redis..." -ForegroundColor Yellow
docker start redis-algocode 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Redis container not found, creating it..." -ForegroundColor Yellow
    docker run -d -p 6379:6379 --name redis-algocode redis
}
Start-Sleep -Seconds 2

$root = Split-Path -Parent $MyInvocation.MyCommand.Path

# Start Problem Service (port 3003)
Write-Host "Starting Problem Service on port 3003..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\Algocode-Problem-Service'; Write-Host 'PROBLEM SERVICE (port 3003)' -ForegroundColor Cyan; node src/index.js"

Start-Sleep -Seconds 1

# Start Socket Service (port 3001)
Write-Host "Starting Socket Service on port 3001..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\AlgoCode-Socket-Service'; Write-Host 'SOCKET SERVICE (port 3001)' -ForegroundColor Cyan; node src/server.js"

Start-Sleep -Seconds 1

# Start Evaluator Service (port 3000)
Write-Host "Starting Evaluator Service on port 3000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\Algocode-Evaluator-Service'; Write-Host 'EVALUATOR SERVICE (port 3000)' -ForegroundColor Cyan; node dist/index.js"

Start-Sleep -Seconds 1

# Start Evaluator Worker (Consumes BullMQ jobs)
Write-Host "Starting Evaluator Worker (BullMQ)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\Algocode-Evaluator-Service'; `$env:RUN_WORKER_ONLY='true'; Write-Host 'EVALUATOR WORKER' -ForegroundColor Cyan; node dist/index.js"

Start-Sleep -Seconds 1

# Start Submission Service (port 3002)
Write-Host "Starting Submission Service on port 3002..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\AlgoCode-Submission-Service'; Write-Host 'SUBMISSION SERVICE (port 3002)' -ForegroundColor Cyan; node src/index.js"

Start-Sleep -Seconds 1

# Start Submission Worker (Consumes Evaluation jobs to notify Socket)
Write-Host "Starting Submission Worker..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\AlgoCode-Submission-Service'; `$env:RUN_WORKER_ONLY='true'; Write-Host 'SUBMISSION WORKER' -ForegroundColor Cyan; node src/index.js"

Start-Sleep -Seconds 1

# Start User Service (port 3004)
Write-Host "Starting User Service on port 3004..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\Algocode-User-Service'; Write-Host 'USER SERVICE (port 3004)' -ForegroundColor Cyan; node src/index.js"

Write-Host ""
Write-Host "All services started! Open these URLs to verify:" -ForegroundColor Cyan
Write-Host "  Problem Service:  http://localhost:3003/ping" -ForegroundColor White
Write-Host "  Evaluator Board:  http://localhost:3000/ui" -ForegroundColor White
Write-Host "  Socket Service:   ws://localhost:3001" -ForegroundColor White
Write-Host "  Submission:       POST http://localhost:3002/api/v1/submissions/" -ForegroundColor White
Write-Host "  User Auth:        http://localhost:3004" -ForegroundColor White

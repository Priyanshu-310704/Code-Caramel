# AlgoCode Backend - Stop All Services
Write-Host "Stopping all AlgoCode services..." -ForegroundColor Yellow

# Kill all node processes
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
Write-Host "All Node.js processes stopped (Frontend and Backend microservices)" -ForegroundColor Green

# Stop Redis container
Write-Host "Stopping Redis container..." -ForegroundColor Yellow
docker stop redis-algocode 2>$null
Write-Host "Redis stopped" -ForegroundColor Green

# Stop any dangling Evaluator containers (cpp, python, java)
Write-Host "Cleaning up dangling executor containers (if any)..." -ForegroundColor Yellow
$dangling = docker ps -q -f "ancestor=gcc" -f "ancestor=python" -f "ancestor=openjdk:18-jdk-alpine"
if ($dangling) {
    docker rm -f $dangling
    Write-Host "Dangling containers cleaned up" -ForegroundColor Green
}

# Show free ports
Write-Host "Verifying ports 3000-3004 and 5500 are free..." -ForegroundColor Yellow
$busy = netstat -ano | Select-String ":(300[0-4]|5500)\s.*LISTENING"
if ($busy) {
    Write-Host "Warning - some ports still in use:" -ForegroundColor Red
    $busy
} else {
    Write-Host "All ports 3000-3004, and 5500 are fully decommissioned. System resources restored!" -ForegroundColor Green
}

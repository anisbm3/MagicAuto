# Starts the Magic Auto frontend + backend dev servers together.
# Usage: right-click > "Run with PowerShell", or from a terminal: .\start.ps1

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

if (-not (Test-Path "backend\.env")) {
    Write-Host "backend\.env not found - copying from backend\.env.example" -ForegroundColor Yellow
    Copy-Item "backend\.env.example" "backend\.env"
    Write-Host "Edit backend\.env with your real DATABASE_URL before continuing if you haven't already." -ForegroundColor Yellow
}

if (-not (Test-Path "frontend\.env")) {
    Write-Host "frontend\.env not found - copying from frontend\.env.example" -ForegroundColor Yellow
    Copy-Item "frontend\.env.example" "frontend\.env"
}

if (-not (Test-Path "node_modules")) {
    Write-Host "Dependencies not installed - running npm install..." -ForegroundColor Cyan
    npm install
}

Write-Host "Starting frontend (http://localhost:5173) and backend (http://localhost:4000)..." -ForegroundColor Green
npm run dev

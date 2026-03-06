# PowerShell script to initialize PostgreSQL database for react-postgres-todo
# Requires: psql.exe in PATH (PostgreSQL client tools installed)

param(
    [string]$PgUser = "postgres",
    [string]$PgHost = "localhost",
    [string]$PgPort = "5432"
)

Write-Host "=== PostgreSQL Database Setup ===" -ForegroundColor Cyan
Write-Host "Database: todo_react_db" -ForegroundColor Yellow
Write-Host "User: $PgUser" -ForegroundColor Yellow
Write-Host "Host: $PgHost" -ForegroundColor Yellow
Write-Host ""

# Check if psql is available
$psqlPath = Get-Command psql -ErrorAction SilentlyContinue
if (-not $psqlPath) {
    Write-Host "ERROR: psql.exe not found in PATH." -ForegroundColor Red
    Write-Host "Please install PostgreSQL client tools or add psql to your PATH." -ForegroundColor Red
    Write-Host "Download from: https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
    exit 1
}

Write-Host "Found psql at: $($psqlPath.Source)" -ForegroundColor Green

# Get the directory of this script
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$sqlFile = Join-Path $scriptDir "db-init.sql"

if (-not (Test-Path $sqlFile)) {
    Write-Host "ERROR: db-init.sql not found at $sqlFile" -ForegroundColor Red
    exit 1
}

Write-Host "SQL file: $sqlFile" -ForegroundColor Green
Write-Host ""

# Prompt for password securely
Write-Host "Enter password for PostgreSQL user '$PgUser':" -ForegroundColor Cyan
$securePassword = Read-Host -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
$password = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

# Set environment variable for psql password
$env:PGPASSWORD = $password

Write-Host ""
Write-Host "Creating database and table..." -ForegroundColor Cyan

# Run the SQL script
# Note: CREATE DATABASE will fail if it exists, but we continue with table creation
$output = & psql -U $PgUser -h $PgHost -p $PgPort -d postgres -f $sqlFile 2>&1

# Clear password from environment
$env:PGPASSWORD = $null

# Check results
$lastExitCode = $LASTEXITCODE
$outputStr = $output -join "`n"

if ($outputStr -match "database.*already exists") {
    Write-Host "NOTE: Database 'todo_react_db' already exists (skipping creation)." -ForegroundColor Yellow
}

if ($outputStr -match "CREATE TABLE" -or $outputStr -match "already exists") {
    Write-Host "SUCCESS: Table 'tasks' is ready!" -ForegroundColor Green
} elseif ($lastExitCode -eq 0) {
    Write-Host "SUCCESS: Database setup completed!" -ForegroundColor Green
} else {
    Write-Host "ERROR: Failed to initialize database." -ForegroundColor Red
    Write-Host $outputStr -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=== Setup Complete ===" -ForegroundColor Green
Write-Host "You can now start the server with: node server.js" -ForegroundColor Cyan

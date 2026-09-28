@echo off
title Automated Timesheet Platform Launcher
echo ========================================================
echo Starting Automated Timesheet Management Platform
echo ========================================================
echo.

set "SCRIPT_DIR=%~dp0"

echo [1/2] Starting Spring Boot Backend (Port 8080)...
start "Timesheet Backend (8080)" cmd /k "cd /d "%SCRIPT_DIR%timesheet-management\backend" && java -jar target\timesheet-backend-0.0.1-SNAPSHOT.jar --server.port=8080"

echo [2/2] Starting React + Vite Frontend (Port 8443)...
start "Timesheet Frontend (8443)" cmd /k "cd /d "%SCRIPT_DIR%" && npm run dev"

timeout /t 4 >nul

echo Opening browser at http://localhost:8443/ ...
start http://localhost:8443/

echo.
echo ========================================================
echo Application is running!
echo Frontend: http://localhost:8443/
echo Backend:  http://localhost:8080/api/timesheets
echo ========================================================

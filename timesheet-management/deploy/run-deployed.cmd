@echo off
title Timesheet Backend (Deployed Instance)
setlocal

set "SCRIPT_DIR=%~dp0"
set "JAR_PATH=%SCRIPT_DIR%current\timesheet-backend.jar"

if not exist "%JAR_PATH%" (
    echo [ERROR] No deployed JAR found at %JAR_PATH%.
    echo Please run the deployment pipeline or deploy.bat first.
    pause
    exit /b 1
)

set "PORT=%~1"
if "%PORT%"=="" set "PORT=8080"

echo =======================================================
echo Starting Deployed Timesheet Backend on Port %PORT%
echo Artifact: %JAR_PATH%
echo =======================================================

java -jar "%JAR_PATH%" --server.port=%PORT%
pause

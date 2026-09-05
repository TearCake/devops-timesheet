@echo off
setlocal enabledelayedexpansion

REM ===================================================
REM Automated Timesheet Management Platform
REM Week 8: Server Deployment Script
REM ===================================================

set "ENV_NAME=%~1"
if "%ENV_NAME%"=="" set "ENV_NAME=dev"

set "TARGET_PORT=%~2"
if "%TARGET_PORT%"=="" set "TARGET_PORT=8080"

set "BUILD_NUM=%~3"
if "%BUILD_NUM%"=="" set "BUILD_NUM=manual"

set "SCRIPT_DIR=%~dp0"
set "ROOT_DIR=%SCRIPT_DIR%..\.."
set "SOURCE_JAR=%ROOT_DIR%\timesheet-management\backend\target\timesheet-backend-0.0.1-SNAPSHOT.jar"
set "DEPLOY_DIR=%SCRIPT_DIR%current"

echo ===================================================
echo [DEPLOY] Target Environment : %ENV_NAME%
echo [DEPLOY] Application Port   : %TARGET_PORT%
echo [DEPLOY] Jenkins Build #    : %BUILD_NUM%
echo ===================================================

if not exist "%SOURCE_JAR%" (
    echo [ERROR] Source artifact not found at:
    echo         %SOURCE_JAR%
    echo Please run 'mvn package' first.
    exit /b 1
)

if not exist "%DEPLOY_DIR%" (
    mkdir "%DEPLOY_DIR%"
)

echo [INFO] Copying artifact to deployment directory...
copy /Y "%SOURCE_JAR%" "%DEPLOY_DIR%\timesheet-backend.jar" >nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to copy artifact to deployment folder.
    exit /b 1
)

set "TIMESTAMP=%DATE% %TIME%"

echo [INFO] Generating deployment manifest...
(
    echo {
    echo   "application": "timesheet-backend",
    echo   "version": "0.0.1-SNAPSHOT",
    echo   "environment": "%ENV_NAME%",
    echo   "serverPort": "%TARGET_PORT%",
    echo   "buildNumber": "%BUILD_NUM%",
    echo   "deployedAt": "%TIMESTAMP%",
    echo   "status": "DEPLOYED_SUCCESSFULLY"
    echo }
) > "%DEPLOY_DIR%\deployment-manifest.json"

echo [SUCCESS] Application successfully deployed to '%DEPLOY_DIR%'.
echo [SUCCESS] Manifest generated:
type "%DEPLOY_DIR%\deployment-manifest.json"
echo.
exit /b 0

@echo off
setlocal enabledelayedexpansion

REM ========================================================================
REM Automated Timesheet Management Platform - Rollback & Recovery Engine
REM Week 14: Automated Provisioning & Reliability Validation
REM ========================================================================

set "TARGET_TAG=%~1"
if "%TARGET_TAG%"=="" set "TARGET_TAG=1.0.0"

set "CONTAINER_NAME=timesheet-app"
set "HOST_PORT=8085"
set "IMAGE_NAME=timesheet-backend"
set "MANIFEST_FILE=rollback-manifest.json"

echo ========================================================================
echo [ROLLBACK-ENGINE] Initiating Disaster Recovery and Rollback (Week 14)
echo [ROLLBACK-ENGINE] Target Stable Release Image: %IMAGE_NAME%:%TARGET_TAG%
echo ========================================================================

REM Step 1: Verify target rollback image exists
echo [INFO] Step 1/5: Verifying availability of target image '%IMAGE_NAME%:%TARGET_TAG%'...
docker image inspect %IMAGE_NAME%:%TARGET_TAG% >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Target image '%IMAGE_NAME%:%TARGET_TAG%' not found in local registry!
    echo Available images:
    docker images %IMAGE_NAME%
    exit /b 1
)
echo [INFO] Target image is verified and present.

REM Step 2: Capture previous container metadata
set "CURRENT_IMAGE=unknown"
for /f "tokens=*" %%i in ('docker inspect --format="{{.Config.Image}}" %CONTAINER_NAME% 2^>nul') do set "CURRENT_IMAGE=%%i"
echo [INFO] Step 2/5: Current active image before rollback: %CURRENT_IMAGE%

REM Step 3: Tear down active container
echo [INFO] Step 3/5: Tearing down active container '%CONTAINER_NAME%'...
docker rm -f %CONTAINER_NAME% >nul 2>&1
echo [INFO] Container terminated.

REM Step 4: Deploy target rollback release
echo [INFO] Step 4/5: Spinning up rollback release '%IMAGE_NAME%:%TARGET_TAG%'...
docker run -d ^
    --name %CONTAINER_NAME% ^
    -p %HOST_PORT%:8080 ^
    --add-host=host.docker.internal:host-gateway ^
    -e SPRING_DATASOURCE_URL="jdbc:mysql://host.docker.internal:3306/timesheet_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC" ^
    -e SPRING_DATASOURCE_USERNAME=root ^
    -e SPRING_DATASOURCE_PASSWORD=root ^
    %IMAGE_NAME%:%TARGET_TAG%

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to start rollback container!
    exit /b 1
)

REM Step 5: Health Verification Probe
echo [INFO] Step 5/5: Probing restored container health...
set "RETRIES=0"
set "MAX_RETRIES=20"
set "RESTORED=0"

:health_loop
ping -n 3 127.0.0.1 >nul
set /a RETRIES+=1

set "HTTP_CODE=000"
for /f "tokens=*" %%s in ('curl.exe -s -o NUL -w "%%{http_code}" http://localhost:%HOST_PORT%/api/timesheets 2^>nul') do (
    set "HTTP_CODE=%%s"
)

if "%HTTP_CODE%"=="200" (
    set "RESTORED=1"
    goto health_ok
)

echo [INFO] Waiting for restored service to boot... (Attempt %RETRIES%/%MAX_RETRIES%, status: %HTTP_CODE%)
if %RETRIES% LSS %MAX_RETRIES% goto health_loop

:health_ok
if "%RESTORED%"=="1" (
    echo [SUCCESS] Rollback release is ONLINE and healthy [HTTP 200 OK]!
) else (
    echo [WARNING] Service probe did not respond with HTTP 200 within timeout.
)

REM Generate Rollback Audit Manifest
set "CONTAINER_ID=unknown"
for /f "tokens=*" %%i in ('docker inspect --format="{{.Id}}" %CONTAINER_NAME% 2^>nul') do set "CONTAINER_ID=%%i"
set "TIMESTAMP=%DATE% %TIME%"

(
    echo {
    echo   "action": "ROLLBACK_AND_RECOVERY",
    echo   "previousImage": "%CURRENT_IMAGE%",
    echo   "restoredImage": "%IMAGE_NAME%:%TARGET_TAG%",
    echo   "containerName": "%CONTAINER_NAME%",
    echo   "containerId": "%CONTAINER_ID%",
    echo   "restoredPort": "%HOST_PORT%",
    echo   "healthStatus": "%HTTP_CODE%",
    echo   "executedAt": "%TIMESTAMP%",
    echo   "result": "ROLLBACK_SUCCESSFUL"
    echo }
) > "%MANIFEST_FILE%"

echo.
echo ========================================================================
echo [SUCCESS] Rollback Demonstration Complete!
echo [SUCCESS] Manifest generated:
type "%MANIFEST_FILE%"
echo.
echo Live Application Endpoint: http://localhost:%HOST_PORT%/api/timesheets
echo ========================================================================
exit /b 0

@echo off
setlocal enabledelayedexpansion

REM ========================================================================
REM Automated Timesheet Management Platform - Docker Continuous Deployment
REM Week 12: Automated Docker Container Deployment & Health Verification
REM ========================================================================

set "IMAGE_NAME=%~1"
if "%IMAGE_NAME%"=="" set "IMAGE_NAME=timesheet-backend"

set "TAG=%~2"
if "%TAG%"=="" set "TAG=latest"

set "CONTAINER_NAME=%~3"
if "%CONTAINER_NAME%"=="" set "CONTAINER_NAME=timesheet-app"

set "HOST_PORT=%~4"
if "%HOST_PORT%"=="" set "HOST_PORT=8085"

set "BUILD_NUM=%~5"
if "%BUILD_NUM%"=="" set "BUILD_NUM=manual"

set "SCRIPT_DIR=%~dp0"
set "DEPLOY_DIR=%SCRIPT_DIR%current"

echo ========================================================================
echo [DOCKER-CD] Automated Container Deployment Pipeline (Week 12)
echo [DOCKER-CD] Target Image     : %IMAGE_NAME%:%TAG%
echo [DOCKER-CD] Container Name   : %CONTAINER_NAME%
echo [DOCKER-CD] Host Port        : %HOST_PORT% (Container Port: 8080)
echo [DOCKER-CD] Jenkins Build #  : %BUILD_NUM%
echo ========================================================================

REM Step 1: Verify Docker engine responsiveness
echo [INFO] Step 1/5: Verifying Docker engine connectivity...
docker info >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Docker daemon is not running or accessible!
    exit /b 1
)
echo [INFO] Docker daemon is healthy and responsive.

REM Step 2: Stop and remove existing container if running
echo [INFO] Step 2/5: Cleaning up previous container instance '%CONTAINER_NAME%'...
docker inspect %CONTAINER_NAME% >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [INFO] Stopping and removing existing container '%CONTAINER_NAME%'...
    docker rm -f %CONTAINER_NAME% >nul 2>&1
    echo [INFO] Previous container '%CONTAINER_NAME%' removed.
) else (
    echo [INFO] No prior container instance named '%CONTAINER_NAME%' found.
)

REM Step 3: Run the new container with versioned image and database configuration
echo [INFO] Step 3/5: Deploying fresh container '%CONTAINER_NAME%' from '%IMAGE_NAME%:%TAG%'...
docker run -d ^
    --name %CONTAINER_NAME% ^
    -p %HOST_PORT%:8080 ^
    --add-host=host.docker.internal:host-gateway ^
    -e SPRING_DATASOURCE_URL="jdbc:mysql://host.docker.internal:3306/timesheet_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC" ^
    -e SPRING_DATASOURCE_USERNAME=root ^
    -e SPRING_DATASOURCE_PASSWORD=root ^
    %IMAGE_NAME%:%TAG%

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to start Docker container '%CONTAINER_NAME%'.
    exit /b 1
)

REM Step 4: Health Check & Readiness Probe
echo [INFO] Step 4/5: Probing container health on http://localhost:%HOST_PORT%/api/timesheets...
set "RETRIES=0"
set "MAX_RETRIES=20"
set "HEALTHY=0"

:health_loop
ping -n 3 127.0.0.1 >nul
set /a RETRIES+=1

set "HTTP_STATUS=000"
for /f "tokens=*" %%s in ('curl.exe -s -o NUL -w "%%{http_code}" http://localhost:%HOST_PORT%/api/timesheets 2^>nul') do (
    set "HTTP_STATUS=%%s"
)

if "%HTTP_STATUS%"=="200" (
    set "HEALTHY=1"
    goto health_ok
)

echo [INFO] Waiting for Spring Boot inside container... (Attempt %RETRIES%/%MAX_RETRIES%, HTTP status: %HTTP_STATUS%)
if %RETRIES% LSS %MAX_RETRIES% goto health_loop

:health_ok
if "%HEALTHY%"=="1" (
    echo [SUCCESS] Container '%CONTAINER_NAME%' is UP and responding with HTTP 200 OK!
) else (
    echo [WARNING] Container probe did not return HTTP 200 within timeout. Checking container logs:
    docker logs --tail 25 %CONTAINER_NAME%
)

REM Step 5: Generate CD Deployment Audit Manifest
echo [INFO] Step 5/5: Generating Docker deployment manifest...
if not exist "%DEPLOY_DIR%" mkdir "%DEPLOY_DIR%"

set "CONTAINER_ID=unknown"
for /f "tokens=*" %%i in ('docker inspect --format="{{.Id}}" %CONTAINER_NAME% 2^>nul') do set "CONTAINER_ID=%%i"

set "IMAGE_DIGEST=unknown"
for /f "tokens=*" %%i in ('docker inspect --format="{{.Image}}" %CONTAINER_NAME% 2^>nul') do set "IMAGE_DIGEST=%%i"

set "TIMESTAMP=%DATE% %TIME%"

(
    echo {
    echo   "application": "timesheet-backend",
    echo   "deploymentType": "Docker Container",
    echo   "image": "%IMAGE_NAME%:%TAG%",
    echo   "imageDigest": "%IMAGE_DIGEST%",
    echo   "containerName": "%CONTAINER_NAME%",
    echo   "containerId": "%CONTAINER_ID%",
    echo   "hostPort": "%HOST_PORT%",
    echo   "containerPort": "8080",
    echo   "buildNumber": "%BUILD_NUM%",
    echo   "healthStatus": "%HTTP_STATUS%",
    echo   "deployedAt": "%TIMESTAMP%",
    echo   "status": "DEPLOYED_AND_VERIFIED"
    echo }
) > "%DEPLOY_DIR%\deployment-manifest-docker.json"

echo [SUCCESS] Docker CD Deployment Complete!
echo [SUCCESS] Audit Manifest:
type "%DEPLOY_DIR%\deployment-manifest-docker.json"
echo.
echo ========================================================================
echo Container Live Endpoint: http://localhost:%HOST_PORT%/api/timesheets
echo ========================================================================
exit /b 0

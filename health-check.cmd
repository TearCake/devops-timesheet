@echo off
setlocal enabledelayedexpansion

REM ========================================================================
REM Automated Timesheet Management Platform - Reliability and Health Check Suite
REM Week 14: Automated Provisioning and Reliability Validation
REM ========================================================================

set "CONTAINER_NAME=timesheet-app"
set "HOST_PORT=8085"
set "FRONTEND_PORT=8443"
set "REPORT_FILE=health-report.json"

echo ========================================================================
echo [HEALTH-CHECK] Running Full Reliability and Health Inspection (Week 14)
echo ========================================================================

set "SCORE=0"
set "TOTAL_CHECKS=5"

REM Check 1: Docker Daemon Engine
echo [1/5] Checking Docker Engine Status...
docker info >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo     [PASS] Docker daemon is active and responsive.
    set /a SCORE+=1
    set "DOCKER_STATUS=HEALTHY"
) else (
    echo     [FAIL] Docker daemon is offline!
    set "DOCKER_STATUS=UNHEALTHY"
)

REM Check 2: Container Runtime State
echo [2/5] Checking Container '%CONTAINER_NAME%' State...
set "CONTAINER_STATUS=DOWN"
set "CONTAINER_IMAGE=UNKNOWN"
set "CONTAINER_UPTIME=UNKNOWN"

for /f "tokens=*" %%i in ('docker inspect --format="{{.State.Status}}" %CONTAINER_NAME% 2^>nul') do set "CONTAINER_STATUS=%%i"
for /f "tokens=*" %%i in ('docker inspect --format="{{.Config.Image}}" %CONTAINER_NAME% 2^>nul') do set "CONTAINER_IMAGE=%%i"
for /f "tokens=*" %%i in ('docker inspect --format="{{.State.StartedAt}}" %CONTAINER_NAME% 2^>nul') do set "CONTAINER_UPTIME=%%i"

if /I "%CONTAINER_STATUS%"=="running" (
    echo     [PASS] Container is RUNNING.
    echo            Image : %CONTAINER_IMAGE%
    echo            Uptime: Started at %CONTAINER_UPTIME%
    set /a SCORE+=1
) else (
    echo     [FAIL] Container '%CONTAINER_NAME%' is %CONTAINER_STATUS%!
)

REM Check 3: Backend REST API Endpoint (HTTP 200)
echo [3/5] Probing Backend API (http://localhost:%HOST_PORT%/api/timesheets)...
set "HTTP_CODE=000"
for /f "tokens=*" %%s in ('curl.exe -s -o NUL -w "%%{http_code}" http://localhost:%HOST_PORT%/api/timesheets 2^>nul') do (
    set "HTTP_CODE=%%s"
)

if "%HTTP_CODE%"=="200" (
    echo     [PASS] API responded with HTTP 200 OK.
    set /a SCORE+=1
    set "API_STATUS=HEALTHY"
) else (
    echo     [FAIL] API returned HTTP status %HTTP_CODE%!
    set "API_STATUS=UNHEALTHY"
)

REM Check 4: Database Data Integrity via API
echo [4/5] Validating Database Live Data Records...
set "DB_STATUS=UNHEALTHY"
curl.exe -s http://localhost:%HOST_PORT%/api/timesheets | findstr /I "timesheetId" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo     [PASS] Database query returned active timesheet records from MySQL.
    set /a SCORE+=1
    set "DB_STATUS=HEALTHY"
) else (
    echo     [WARN] No records returned or database query failed.
)

REM Check 5: Frontend Web Application
echo [5/5] Checking Frontend UI (http://localhost:%FRONTEND_PORT%)...
set "FRONT_CODE=000"
for /f "tokens=*" %%s in ('curl.exe -s -o NUL -w "%%{http_code}" http://localhost:%FRONTEND_PORT%/ 2^>nul') do (
    set "FRONT_CODE=%%s"
)

if "%FRONT_CODE%"=="200" (
    echo     [PASS] Frontend Vite dev server is UP [HTTP 200].
    set /a SCORE+=1
    set "FRONT_STATUS=HEALTHY"
) else (
    echo     [WARN] Frontend server returned HTTP %FRONT_CODE%.
    set "FRONT_STATUS=DEGRADED"
)

REM Calculate percentage score
set /a HEALTH_PERCENT=(SCORE * 100) / TOTAL_CHECKS

echo ========================================================================
echo Overall System Reliability Score: !SCORE!/!TOTAL_CHECKS! (!HEALTH_PERCENT! percent)
if !SCORE! GEQ 4 (
    echo System Status: [HEALTHY - PRODUCTION READY]
    set "SYSTEM_STATE=HEALTHY"
) else (
    echo System Status: [ATTENTION REQUIRED]
    set "SYSTEM_STATE=DEGRADED"
)
echo ========================================================================

REM Generate JSON Health Report
set "TIMESTAMP=%DATE% %TIME%"
(
    echo {
    echo   "reportType": "System Reliability and Health Audit",
    echo   "timestamp": "%TIMESTAMP%",
    echo   "systemState": "%SYSTEM_STATE%",
    echo   "healthScore": "%SCORE%/%TOTAL_CHECKS%",
    echo   "healthPercentage": "%HEALTH_PERCENT% percent",
    echo   "components": {
    echo     "dockerEngine": "%DOCKER_STATUS%",
    echo     "container": {
    echo       "name": "%CONTAINER_NAME%",
    echo       "image": "%CONTAINER_IMAGE%",
    echo       "status": "%CONTAINER_STATUS%",
    echo       "startedAt": "%CONTAINER_UPTIME%"
    echo     },
    echo     "backendApi": {
    echo       "endpoint": "http://localhost:%HOST_PORT%/api/timesheets",
    echo       "httpStatus": "%HTTP_CODE%",
    echo       "status": "%API_STATUS%"
    echo     },
    echo     "database": {
    echo       "connection": "%DB_STATUS%",
    echo       "target": "timesheet_db"
    echo     },
    echo     "frontend": {
    echo       "endpoint": "http://localhost:%FRONTEND_PORT%",
    echo       "httpStatus": "%FRONT_CODE%",
    echo       "status": "%FRONT_STATUS%"
    echo     }
    echo   }
    echo }
) > "%REPORT_FILE%"

echo [INFO] Health report saved to '%REPORT_FILE%'.
exit /b 0

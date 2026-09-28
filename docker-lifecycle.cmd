@echo off
setlocal enabledelayedexpansion

REM ========================================================
REM Automated Timesheet Management Platform
REM Week 11: Docker Container Lifecycle Management Script
REM ========================================================

set "ACTION=%~1"
if "%ACTION%"=="" set "ACTION=status"

set "IMAGE_NAME=timesheet-backend"
set "TAG=latest"
set "CONTAINER_NAME=timesheet-app"
set "HOST_PORT=8085"
set "CONTAINER_PORT=8080"

if /I "%ACTION%"=="build" goto do_build
if /I "%ACTION%"=="run" goto do_run
if /I "%ACTION%"=="logs" goto do_logs
if /I "%ACTION%"=="stop" goto do_stop
if /I "%ACTION%"=="start" goto do_start
if /I "%ACTION%"=="restart" goto do_restart
if /I "%ACTION%"=="clean" goto do_clean
if /I "%ACTION%"=="status" goto do_status

echo Usage: docker-lifecycle.cmd [build^|run^|logs^|stop^|start^|restart^|clean^|status]
exit /b 1

:do_build
echo [DOCKER] Building image: %IMAGE_NAME%:%TAG%...
docker build -t %IMAGE_NAME%:1.0.0 -t %IMAGE_NAME%:v1.0.0 -t %IMAGE_NAME%:%TAG% .
goto done

:do_run
echo [DOCKER] Running container '%CONTAINER_NAME%' on port %HOST_PORT%:%CONTAINER_PORT%...
docker run -d --name %CONTAINER_NAME% -p %HOST_PORT%:%CONTAINER_PORT% --add-host=host.docker.internal:host-gateway -e SPRING_DATASOURCE_URL="jdbc:mysql://host.docker.internal:3306/timesheet_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC" -e SPRING_DATASOURCE_USERNAME=root -e SPRING_DATASOURCE_PASSWORD=root %IMAGE_NAME%:%TAG%
goto done

:do_logs
echo [DOCKER] Inspecting logs for '%CONTAINER_NAME%'...
docker logs --tail 50 -f %CONTAINER_NAME%
goto done

:do_stop
echo [DOCKER] Stopping container '%CONTAINER_NAME%'...
docker stop %CONTAINER_NAME%
goto done

:do_start
echo [DOCKER] Starting container '%CONTAINER_NAME%'...
docker start %CONTAINER_NAME%
goto done

:do_restart
echo [DOCKER] Restarting container '%CONTAINER_NAME%'...
docker restart %CONTAINER_NAME%
goto done

:do_clean
echo [DOCKER] Stopping and removing container '%CONTAINER_NAME%'...
docker rm -f %CONTAINER_NAME%
goto done

:do_status
echo ========================================================
echo [DOCKER] Container Status:
echo ========================================================
docker ps -a --filter "name=%CONTAINER_NAME%"
echo.
echo ========================================================
echo [DOCKER] Images:
echo ========================================================
docker images %IMAGE_NAME%
goto done

:done
exit /b 0

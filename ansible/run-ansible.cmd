@echo off
setlocal enabledelayedexpansion

REM ========================================================================
REM Automated Timesheet Management Platform - Ansible Runner (Windows/Docker)
REM Week 13: Configuration Management Automation Harness
REM ========================================================================

set "MODE=%~1"
if "%MODE%"=="" set "MODE=check"

set "SCRIPT_DIR=%~dp0"

echo ========================================================================
echo [ANSIBLE-IAC] Timesheet Platform Infrastructure as Code Runner
echo [ANSIBLE-IAC] Mode: %MODE% (syntax / check / run)
echo ========================================================================

docker info >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Docker daemon is not running! Docker is required to run the Ansible controller container.
    exit /b 1
)

if /I "%MODE%"=="syntax" (
    echo [INFO] Running Ansible Syntax Check...
    docker run --rm -v "%SCRIPT_DIR%:/workspace" -w /workspace python:3.12-alpine sh -c "pip install --quiet ansible-core && ANSIBLE_CONFIG=/workspace/ansible.cfg ansible-playbook --syntax-check playbook.yml -i inventory.ini"
    exit /b %ERRORLEVEL%
)

if /I "%MODE%"=="check" (
    echo [INFO] Running Ansible Dry Run (--check mode)...
    docker run --rm -v "%SCRIPT_DIR%:/workspace" -w /workspace python:3.12-alpine sh -c "pip install --quiet ansible-core && ANSIBLE_CONFIG=/workspace/ansible.cfg ansible-playbook -i 'localhost,' -c local playbook.yml --check"
    exit /b %ERRORLEVEL%
)

if /I "%MODE%"=="run" (
    echo [INFO] Running Full Ansible Playbook Execution...
    docker run --rm -v "%SCRIPT_DIR%:/workspace" -w /workspace python:3.12-alpine sh -c "pip install --quiet ansible-core && ANSIBLE_CONFIG=/workspace/ansible.cfg ansible-playbook -i 'localhost,' -c local playbook.yml"
    exit /b %ERRORLEVEL%
)

echo Usage: run-ansible.cmd [syntax^|check^|run]
exit /b 1

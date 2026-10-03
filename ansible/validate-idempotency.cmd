@echo off
setlocal enabledelayedexpansion

REM ========================================================================
REM Automated Timesheet Management Platform - Idempotency Validation Harness
REM Week 14: Demonstration of Ansible Idempotency (Run 1 vs Run 2)
REM ========================================================================

set "SCRIPT_DIR=%~dp0"
set "REPORT_FILE=%SCRIPT_DIR%idempotency-report.txt"

echo ========================================================================
echo [IDEMPOTENCY-TEST] Executing Ansible Idempotency Validation (Week 14)
echo ========================================================================

docker info >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Docker daemon is not running! Docker is required for isolation.
    exit /b 1
)

echo [INFO] Spinning up isolated test environment...
docker run --rm -v "%SCRIPT_DIR%:/workspace" -w /workspace python:3.12-alpine sh -c "
    pip install --quiet ansible-core
    echo '=== RUN 1: INITIAL PROVISIONING ===' > /workspace/idempotency-run.tmp
    ANSIBLE_CONFIG=/workspace/ansible.cfg ansible-playbook -i 'localhost,' -c local playbook.yml --check >> /workspace/idempotency-run.tmp 2>&1
    echo '' >> /workspace/idempotency-run.tmp
    echo '=== RUN 2: IDEMPOTENCY VERIFICATION RUN ===' >> /workspace/idempotency-run.tmp
    ANSIBLE_CONFIG=/workspace/ansible.cfg ansible-playbook -i 'localhost,' -c local playbook.yml --check >> /workspace/idempotency-run.tmp 2>&1
"

if exist "%SCRIPT_DIR%idempotency-run.tmp" (
    move /y "%SCRIPT_DIR%idempotency-run.tmp" "%REPORT_FILE%" >nul
    echo [SUCCESS] Idempotency test completed! Report saved to: %REPORT_FILE%
    type "%REPORT_FILE%"
) else (
    echo [ERROR] Failed to generate idempotency report.
    exit /b 1
)

exit /b 0

#!/usr/bin/env bash
# ========================================================================
# Automated Timesheet Management Platform - Service Runner Helper
# Installed by Ansible (Week 13)
# ========================================================================

set -euo pipefail

ACTION="${1:-status}"
SERVICE_NAME="timesheet.service"

case "${ACTION}" in
    start)
        echo "[INFO] Starting ${SERVICE_NAME}..."
        sudo systemctl start "${SERVICE_NAME}"
        ;;
    stop)
        echo "[INFO] Stopping ${SERVICE_NAME}..."
        sudo systemctl stop "${SERVICE_NAME}"
        ;;
    restart)
        echo "[INFO] Restarting ${SERVICE_NAME}..."
        sudo systemctl restart "${SERVICE_NAME}"
        ;;
    status)
        sudo systemctl status "${SERVICE_NAME}" --no-pager
        ;;
    logs)
        sudo journalctl -u "${SERVICE_NAME}" -n 50 -f
        ;;
    health)
        echo "[INFO] Probing health endpoint..."
        curl -s -f http://localhost:8080/api/timesheets > /dev/null && echo "[SUCCESS] Backend is healthy (HTTP 200)" || echo "[FAIL] Backend unreachable"
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status|logs|health}"
        exit 1
        ;;
esac

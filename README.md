# ⏱️ Automated Timesheet Management Platform

[![DevOps Curriculum](https://img.shields.io/badge/DevOps-15--Week%20Complete-brightgreen?style=flat-square)](file:///c:/Coding/CLG/dev/BACKLOG.md)
[![Release](https://img.shields.io/badge/Release-v1.0.0--final-blue?style=flat-square)](file:///c:/Coding/CLG/dev/FINAL_PROJECT_REPORT.md)
[![CI/CD](https://img.shields.io/badge/Jenkins-Pipeline%20as%20Code-orange?style=flat-square)](file:///c:/Coding/CLG/dev/Jenkinsfile)
[![Docker](https://img.shields.io/badge/Docker-153MB%20Alpine-blue?style=flat-square)](file:///c:/Coding/CLG/dev/Dockerfile)
[![Ansible](https://img.shields.io/badge/Ansible-100%25%20Idempotent-red?style=flat-square)](file:///c:/Coding/CLG/dev/ansible/playbook.yml)
[![Reliability](https://img.shields.io/badge/Health%20Check-5%2F5%20(100%25)-success?style=flat-square)](file:///c:/Coding/CLG/dev/health-check.cmd)

> **Academic Project**: Full-Stack Automated Timesheet Platform with Enterprise CI/CD, Containerization, and Configuration Management.  
> **Student**: Aditya Chavan (Roll No: 23102B0006)  
> **Repository**: [https://github.com/TearCake/devops-timesheet.git](https://github.com/TearCake/devops-timesheet.git)

---

## 📌 Executive Summary

The **Automated Timesheet Management Platform** is a 15-week DevOps curriculum project demonstrating modern software delivery from code commit to containerized cloud deployment.

It couples a responsive **React 19 + Vite** frontend and **Spring Boot 3 + MySQL** REST backend with an enterprise DevOps ecosystem:
- **Declarative Pipeline as Code** in Jenkins (`Jenkinsfile`)
- **Automated Quality Gates** with headless Selenium WebDriver 4 and failure screenshot capture
- **Containerization & Continuous Deployment** with multi-stage Docker Alpine images (153MB)
- **Infrastructure as Code** with Ansible (mathematically proven 100% idempotency)
- **Disaster Recovery Engine** providing single-command rollback with zero data loss

---

## 🏗️ Architectural Topology

```text
┌─────────────────────────┐          REST / JSON          ┌──────────────────────────┐
│   React 19 + Vite UI    │ ────────────────────────────► │ Spring Boot Container    │
│   http://localhost:8443 │ ◄──────────────────────────── │ http://localhost:8085    │
└─────────────────────────┘                               └────────────┬─────────────┘
                                                                       │ JDBC
                                                                       ▼
┌─────────────────────────┐     Pipeline as Code (CI/CD)   ┌──────────────────────────┐
│   Jenkins CI/CD Server  │ ────────────────────────────► │ MySQL Relational DB      │
│   http://localhost:9090 │                               │ localhost:3306           │
└─────────────────────────┘                               └──────────────────────────┘
```

---

## 🚀 Live Services & Quick Access

| Service | Port | Endpoint | Purpose |
| :--- | :---: | :--- | :--- |
| **Frontend UI** | `8443` | [http://localhost:8443](http://localhost:8443) | Timesheet logging, manager approval, CSV export |
| **Backend API** | `8085` | [http://localhost:8085/api/timesheets](http://localhost:8085/api/timesheets) | Live REST API container instance |
| **Jenkins CI/CD** | `9090` | [http://localhost:9090](http://localhost:9090) | Automated build, testing, and deployment pipeline |
| **Database** | `3306` | `localhost:3306/timesheet_db` | Relational database persistence |

---

## 🗂️ 15-Week DevOps Roadmap & Documentation

| Sprint / Week | Focus Area | Detailed Guide & Deliverables | Status |
| :---: | :--- | :--- | :---: |
| **Weeks 1–3** | Requirements, Architecture & Setup | [`project.md`](file:///c:/Coding/CLG/dev/project.md), `schema.sql`, SRS summary | ✅ Done |
| **Weeks 4–6** | Git Collaboration & MVP | [`BRANCHING_STRATEGY.md`](file:///c:/Coding/CLG/dev/BRANCHING_STRATEGY.md), [`MERGE_CONFLICT_EVIDENCE.md`](file:///c:/Coding/CLG/dev/MERGE_CONFLICT_EVIDENCE.md) | ✅ Done |
| **Weeks 7–8** | Jenkins CI & Pipeline as Code | [`JENKINS_SETUP_GUIDE.md`](file:///c:/Coding/CLG/dev/JENKINS_SETUP_GUIDE.md), [`WEEK8_PIPELINE_GUIDE.md`](file:///c:/Coding/CLG/dev/WEEK8_PIPELINE_GUIDE.md) | ✅ Done |
| **Weeks 9–10** | Continuous Testing & Quality Gates | [`WEEK9_TEST_PLAN.md`](file:///c:/Coding/CLG/dev/WEEK9_TEST_PLAN.md), [`WEEK10_CONTINUOUS_TESTING.md`](file:///c:/Coding/CLG/dev/WEEK10_CONTINUOUS_TESTING.md) | ✅ Done |
| **Weeks 11–12** | Docker Containerization & CD | [`WEEK11_DOCKER_LIFECYCLE.md`](file:///c:/Coding/CLG/dev/WEEK11_DOCKER_LIFECYCLE.md), [`WEEK12_JENKINS_DOCKER_CD.md`](file:///c:/Coding/CLG/dev/WEEK12_JENKINS_DOCKER_CD.md) | ✅ Done |
| **Weeks 13–14** | Ansible IaC, Idempotency & Rollback | [`WEEK13_CONFIGURATION_MANAGEMENT.md`](file:///c:/Coding/CLG/dev/WEEK13_CONFIGURATION_MANAGEMENT.md), [`WEEK14_PROVISIONING_AND_RELIABILITY.md`](file:///c:/Coding/CLG/dev/WEEK14_PROVISIONING_AND_RELIABILITY.md) | ✅ Done |
| **Week 15** | Final Release, Report & Viva | [`FINAL_PROJECT_REPORT.md`](file:///c:/Coding/CLG/dev/FINAL_PROJECT_REPORT.md), [`DEMO_PRESENTATION_GUIDE.md`](file:///c:/Coding/CLG/dev/DEMO_PRESENTATION_GUIDE.md) | ✅ Done |

---

## ⚡ Quick-Start Commands

### 1. Launch All Services
```powershell
# Start Jenkins CI Server:
cmd /c .\start-jenkins.cmd

# Start Docker Backend Container:
docker start timesheet-app

# Start Frontend UI:
npm run dev
```

### 2. Verify Reliability & System Health
```powershell
# Run the 5-Tier Health Check Suite:
.\health-check.cmd
```

### 3. Disaster Recovery & Rollback
```powershell
# Rollback to stable release v1.0.0 (in <6 seconds):
.\rollback.cmd 1.0.0

# Restore back to latest build:
.\rollback.cmd build-6
```

### 4. Infrastructure as Code Validation
```powershell
# Validate Ansible Playbook syntax & idempotency:
.\ansible\run-ansible.cmd check
.\ansible\validate-idempotency.cmd
```

---

## 🎓 Viva & Presentation Resources
- 🎤 **[Professor Demo Presentation Guide](file:///c:/Coding/CLG/dev/DEMO_PRESENTATION_GUIDE.md)**: 60-second elevator pitch, 7-minute live demo script, and top 15 viva questions.
- 📋 **[Final Project Report](file:///c:/Coding/CLG/dev/FINAL_PROJECT_REPORT.md)**: Architecture documentation, troubleshooting guide, limitations, and future enhancements.
- 📋 **[Product Backlog & Sprint Tracking](file:///c:/Coding/CLG/dev/BACKLOG.md)**: Sprints 1 through 15 tracking matrix.

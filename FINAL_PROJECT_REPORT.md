# 🎓 Automated Timesheet Management Platform: Final Project Report

**Academic Course**: DevOps Engineering (15-Week Curriculum)  
**Student**: Aditya Chavan  
**Roll No**: 23102B0006  
**Repository**: `https://github.com/TearCake/devops-timesheet.git`  
**Final Release Version**: `v1.0.0-final`  
**Date of Completion**: October 2026  

---

## 📋 Executive Summary

The **Automated Timesheet Management Platform** is a full-stack, enterprise-grade web application and DevOps pipeline engineered over an intensive 15-week curriculum. The project addresses the inefficiencies and inaccuracies of manual corporate employee time-tracking by providing a modern digital platform paired with a fully automated, production-grade DevOps lifecycle.

The application is built on a decoupled architecture comprising a **React 19 + Vite** frontend, a **Java 17 + Spring Boot 3** REST API backend, and a **MySQL** relational database. Surrounding the application is an enterprise CI/CD and Infrastructure as Code ecosystem:
- **Git/GitHub** for branching and release governance.
- **Jenkins** for Pipeline as Code (`Jenkinsfile`) orchestration.
- **Selenium WebDriver 4** for automated end-to-end regression testing and quality gates.
- **Docker** for containerization, image versioning, and lifecycle management.
- **Ansible** for agentless Infrastructure as Code and idempotent host provisioning.
- **Automated Health Monitoring & Rollback Engine** for disaster recovery and high availability.

---

## 🏗️ System Architecture & Workflow

```mermaid
flowchart TD
    subgraph Developer_Workflow["1. Source Control & Collaboration"]
        DEV["👨‍💻 Developer"] -->|Feature Branch| GIT["Git / GitHub Repo<br/>(feature/* ➔ develop ➔ main)"]
    end

    subgraph CI_Pipeline["2. Continuous Integration & Quality Gate"]
        GIT -->|Webhook / SCM Trigger| JENKINS["⚙️ Jenkins CI Server<br/>(http://localhost:9090)"]
        JENKINS --> STG1["Maven Compile & Build"]
        STG1 --> STG2["Automated Tests & Quality Gate<br/>(JUnit 5 + Headless Selenium)"]
        STG2 -->|Pass| STG3["Package Executable JAR<br/>(Artifact Archiving)"]
        STG2 -->|Fail| STOP["Quality Gate Halt Build<br/>(Screenshots Archived)"]
    end

    subgraph CD_Pipeline["3. Continuous Deployment & Docker Engine"]
        STG3 --> DOCKER_BLD["Build Versioned Image<br/>(timesheet-backend:build-${BUILD_NUMBER})"]
        DOCKER_BLD --> DOCKER_TAG["Catalog & Release Tag<br/>(v1.2.${BUILD_NUMBER} & latest)"]
        DOCKER_TAG --> DOCKER_RUN["Automated Container Deploy<br/>(timesheet-management/deploy/deploy-docker.cmd)"]
        DOCKER_RUN --> CONT["Docker Container: timesheet-app<br/>(Host: 8085 ➔ Container: 8080)"]
    end

    subgraph IaC_Reliability["4. Infrastructure as Code & Reliability"]
        ANSIBLE["Ansible Playbook (IaC)<br/>(ansible/playbook.yml)"] -->|Provision Host| HOST["6 Domains Automated<br/>(Packages, Users, Folders, Files, Ports, Services)"]
        HEALTH["Health Check Suite<br/>(health-check.cmd)"] -->|Probe (100% Score)| CONT
        ROLLBACK["Rollback Engine<br/>(rollback.cmd)"] -->|Instant Recovery| CONT
    end

    subgraph User_Tiers["5. End-User Presentation"]
        BROWSER["🌐 End User Browser"] -->|Port 8443| UI["React + Vite Frontend"]
        UI -->|Port 8085 API| CONT
        CONT -->|Port 3306| DB[("MySQL Database<br/>timesheet_db")]
    end
```

---

## 📅 15-Week Timeline & Sprints Summary

| Week | Focus Area | Key Deliverables & Evidence | Status |
| :---: | :--- | :--- | :---: |
| **Week 1** | Problem Statement & Scope | Problem statement, stakeholder identification, core objectives, MVP boundaries | ✅ Completed |
| **Week 2** | Agile Planning & User Stories | 10 core user stories, acceptance criteria, DevOps workflow diagram | ✅ Completed |
| **Week 3** | SRS, Architecture & Schema | SRS summary, `schema.sql`, REST API catalog, working local project skeleton | ✅ Completed |
| **Week 4** | Git & Repository Initialization | GitHub repository, `.gitignore`, branching conventions, PR/Issue templates | ✅ Completed |
| **Week 5** | Feature Development | Timesheet creation, status transitions on feature branch, PR reviews | ✅ Completed |
| **Week 6** | MVP Completion & Git Collab | Filter/search, edit/delete, merge conflict demo & resolution, tag `v0.1.0-mvp` | ✅ Completed |
| **Week 7** | Jenkins Installation & CI Job | Jenkins server setup on port 9090, Maven CI build job, artifact archiving | ✅ Completed |
| **Week 8** | Pipeline as Code (Jenkinsfile) | Declarative `Jenkinsfile`, parameterized build, automated deployment script | ✅ Completed |
| **Week 9** | Selenium Automated Testing | Selenium WebDriver 4 test suite (5 E2E journeys), headless Chrome/Edge execution | ✅ Completed |
| **Week 10** | Continuous Testing in Jenkins | JUnit reporting, Quality Gate halting broken builds, failure screenshot capture | ✅ Completed |
| **Week 11** | Docker Containerization | Multi-stage `Dockerfile` (`eclipse-temurin:17-jre-alpine`), port mapping `8085:8080` | ✅ Completed |
| **Week 12** | Continuous Deployment (CD) | Commit-to-container pipeline, versioned images `build-${BUILD_NUMBER}`, automated redeployment | ✅ Completed |
| **Week 13** | Configuration Management | Ansible Playbook automating 6 domains (packages, users, folders, files, ports, services) | ✅ Completed |
| **Week 14** | Automated Provisioning & Reliability | Idempotency proof (`changed=0` on re-run), 5-tier health check (100%), rollback engine | ✅ Completed |
| **Week 15** | Final Release & Viva Prep | Final release tag `v1.0.0-final`, presentation guide, viva Q&A, comprehensive report | ✅ Completed |

---

## 💻 Technical Implementation Details

### 1. Application Layer (React + Spring Boot + MySQL)
- **Backend**: Spring Boot 3 REST API with Spring Data JPA and Hibernate. Exposes `/api/timesheets` and `/api/projects` endpoints with full CRUD, filtering by date and keyword, and role-based status transitions (`DRAFT` ➔ `SUBMITTED` ➔ `APPROVED` / `REJECTED`).
- **Frontend**: React 19 built with Vite and Tailwind CSS. Features dynamic dual-port backend detection (auto-routing between Docker port 8085 and native port 8080), client-side CSV export, live status updates, and interactive modal dialogs.
- **Database**: Relational MySQL database (`timesheet_db`) tracking employees, projects, timesheet logs, and audit timestamps.

### 2. CI/CD Pipeline as Code (`Jenkinsfile`)
Codified as a declarative pipeline running on the Jenkins agent:
1. `Checkout & Validate`: Verifies Git commit SHA and branch metadata.
2. `Build (Compile)`: Compiles Java source files with Maven.
3. `Automated Tests & Quality Gate`: Runs JUnit unit tests and headless Selenium UI tests. Halts immediately on failure and archives screenshot evidence.
4. `Package Artifact`: Packages executable JAR and archives it with SHA fingerprinting.
5. `Build Docker Image`: Builds versioned container image `timesheet-backend:build-${env.BUILD_NUMBER}`.
6. `Tag & Registry Catalog`: Applies semantic version tags (`v1.2.${BUILD_NUMBER}`) and local image cataloging.
7. `Deploy Docker Container`: Executes `deploy-docker.cmd` to gracefully swap containers.
8. `Container Health Verification`: Probes `/api/timesheets` until HTTP 200 is confirmed and archives `deployment-manifest-docker.json`.

### 3. Automated Quality Gate & Selenium E2E Tests
- Built on **Selenium WebDriver 4** with headless Chrome/Edge execution.
- Features **`ScreenshotExtension.java`**, an automated JUnit 5 callback that detects test failures, captures high-resolution screenshots, and saves them to `target/screenshots/`.
- Proven in Week 10: Deliberate defect in Build #4 halted the pipeline and archived failure screenshots; defect correction in Build #5 resulted in a clean green build.

### 4. Docker Containerization & Lifecycle Management
- Production-hardened multi-stage [`Dockerfile`](file:///c:/Coding/CLG/dev/Dockerfile) based on **Eclipse Temurin 17 JRE Alpine**, slashing container footprint to **153MB**.
- Container executes under a non-root system user (`appuser:appgroup`) for security hardening.
- Port mapped from host `8085` to container `8080`, with database network bridge via `host.docker.internal:host-gateway`.

### 5. Ansible Configuration Management & Idempotency
- Master playbook [`ansible/playbook.yml`](file:///c:/Coding/CLG/dev/ansible/playbook.yml) automates all 6 core operating system domains: Packages, Users, Folders, Files, Ports, and Services.
- **Idempotency Proof**: Executing the playbook twice on the same node resulted in **Run 1: `changed=7`** and **Run 2: `changed=0`**, mathematically proving zero configuration drift.

### 6. Reliability Engineering & Disaster Recovery
- **Health Check Suite** ([`health-check.cmd`](file:///c:/Coding/CLG/dev/health-check.cmd)): Validates all 5 architectural tiers (Docker daemon, Container uptime, REST API HTTP 200, MySQL queries, and Frontend UI) producing an automated **100% HEALTHY** score.
- **Rollback Engine** ([`rollback.cmd`](file:///c:/Coding/CLG/dev/rollback.cmd)): Instant, single-command restoration to any previous stable container release (`.\rollback.cmd 1.0.0`) in under 8 seconds with **zero database data loss**.

---

## 🛠️ Operational Troubleshooting Guide

| Problem | Root Cause | Resolution |
| :--- | :--- | :--- |
| Container shows `Exited (255)` | Docker host rebooted or container crashed | Run `docker start timesheet-app` or `.\health-check.cmd` to diagnose. |
| Backend returns HTTP 500 on save | MySQL database service stopped on host | Verify MySQL service is running on port 3306 (`netstat -ano \| findstr 3306`). |
| Jenkins pipeline fails on `git checkout` | Branch specifier mismatch | Ensure job configuration in Jenkins specifies `*/develop` or `*/main`. |
| Selenium test fails during CI | Display server unavailable on CI node | Ensure tests run with headless flags (`--headless=new`, `--disable-gpu`). |
| Port 8085 already bound | Previous zombie container instance running | Run `docker rm -f timesheet-app` to free host port 8085. |

---

## ⚠️ Limitations & Future Enhancements

### Project Limitations (Academic Constraints)
1. **Single-Node Execution**: Deployment targets a single host machine rather than a distributed Kubernetes cluster.
2. **Local Registry**: Docker images are cataloged locally rather than pushed to a remote private Docker Hub or AWS ECR repository.
3. **Basic Authentication**: Authentication uses role-based toggles rather than an enterprise OAuth2 / Keycloak identity provider.

### Future Enhancements
1. **Kubernetes Orchestration**: Implement Helm charts and Kubernetes manifests (Deployments, StatefulSets, Ingress, Horizontal Pod Autoscalers).
2. **Observability Stack**: Deploy Prometheus and Grafana dashboards tracking JVM metrics, request rates, and error budgets.
3. **Cloud Infrastructure**: Use Terraform to provision AWS ECS/EKS clusters and RDS Aurora instances with automated DNS routing.

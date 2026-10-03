# 📋 Product Backlog & Sprint Tracking

**Project**: Automated Timesheet Management Platform  
**DevOps Curriculum**: 15-Week Plan  
**Student**: Aditya Chavan (Roll No: 23102B0006)  

---

## 🚀 Sprint Overview & Progress

| Sprint / Week | Focus Area | Status | Deliverables |
| :--- | :--- | :---: | :--- |
| **Week 1** | Problem Definition & Scope | ✅ **DONE** | Problem statement, stakeholders, objectives, MVP scope |
| **Week 2** | Agile Planning & DevOps Workflow | ✅ **DONE** | User stories, acceptance criteria, DevOps lifecycle diagram |
| **Week 3** | SRS, Architecture & Technology Setup | ✅ **DONE** | SRS summary, schema.sql, API design, working skeleton |
| **Week 4** | Git & GitHub Repository Initialization | ✅ **DONE** | GitHub repo, .gitignore, README, Issue/PR templates |
| **Week 5** | Feature Development with Branching | ✅ **DONE** | Timesheet creation & status workflow on feature branch |
| **Week 6** | MVP Completion & Git Collaboration | ✅ **DONE** | Search/filter, edit/delete, merge conflict demo, tag v0.1.0-mvp |
| **Week 7** | Jenkins Installation & CI Pipeline | ✅ **DONE** | Jenkins server, Maven CI build job, artifact archiving |
| **Week 8** | Pipeline as Code (Jenkinsfile) | ✅ **DONE** | Declarative Jenkinsfile, automated packaging & deployment |
| **Week 9** | Selenium WebDriver Test Automation | ✅ **DONE** | UI test scripts, assertions, failure screenshot mechanism |
| **Week 10** | Continuous Testing in Jenkins | ✅ **DONE** | Test reporting in Jenkins, quality gates, defect validation |
| **Week 11** | Docker Containerization | ✅ **DONE** | Dockerfile, container lifecycle management, port mappings |
| **Week 12** | Jenkins-Docker Continuous Deployment | ✅ **DONE** | Commit-to-container CD pipeline, versioned images, automated container redeployment |
| **Week 13** | Configuration Management (Ansible) | ✅ **DONE** | Infrastructure-as-Code playbook, inventory, 6-domain automation, execution log |
| **Week 14** | Automated Provisioning & Rollback | ✅ **DONE** | Idempotency evidence (changed=0), 5-tier health check (100%), rollback/recovery engine |
| **Week 15** | End-to-End Demo, Documentation & Viva | ⏳ *Planned* | Final live demonstration, comprehensive report & viva |

---

## 🎯 Completed User Stories (Weeks 1–14)

- [x] **US-01**: As an Employee, I want to create timesheet entries with date, hours, and descriptions so that I can log my daily work.
- [x] **US-02**: As an Employee, I want to view all my logged timesheets in a responsive table.
- [x] **US-03**: As an Employee, I want to edit and update my DRAFT timesheet entries before submitting.
- [x] **US-04**: As an Employee, I want to submit DRAFT timesheets for Manager approval.
- [x] **US-05**: As a Manager, I want to review submitted timesheets and either APPROVE or REJECT them.
- [x] **US-06**: As an Employee/Manager, I want to search and filter timesheets by status and keyword.
- [x] **US-07**: As a User, I want to view a real-time summary dashboard with total hours, pending approvals, and active projects.
- [x] **US-08 (DevOps)**: As a Developer, I want a structured Git branching model (`main`, `develop`, `feature/*`), issue templates, and documented merge conflict resolutions.
- [x] **US-09**: As an Admin/Manager, I want to view and manage projects so that employees can allocate timesheets dynamically.
- [x] **US-10**: As a Manager/Employee, I want to export filtered timesheet records to a CSV report for external reporting.
- [x] **US-11 (CI/CD)**: As a DevOps Engineer, I want an automated Jenkins CI build job that pulls from GitHub, builds with Maven, and archives the packaged `.jar` artifact.
- [x] **US-12 (Pipeline as Code)**: As a DevOps Engineer, I want a declarative `Jenkinsfile` pipeline defining checkout, build, automated testing, artifact packaging, parameterized environment selection, and deployment manifest generation.
- [x] **US-13 (Test Automation)**: As a QA/DevOps Engineer, I want automated Selenium WebDriver E2E test scripts covering 5 critical user journeys with validations and an automated failure screenshot mechanism.
- [x] **US-14 (Continuous Testing & Quality Gates)**: As a DevOps Engineer, I want an automated CI/CD pipeline in Jenkins that executes unit and Selenium tests, publishes JUnit test reports, archives evidence screenshots, and halts deployment upon any test failure.
- [x] **US-15 (Docker Containerization & Lifecycle Management)**: As a DevOps Engineer, I want an optimized Dockerfile for the Spring Boot backend, container lifecycle management automation, port mapping, and health check validation.
- [x] **US-16 (Jenkins-Docker Continuous Deployment)**: As a DevOps Engineer, I want an automated commit-to-container CD pipeline in `Jenkinsfile` that builds versioned Docker images (`timesheet-backend:build-${BUILD_NUMBER}`), tags releases, redeploys the container automatically, and verifies health via HTTP readiness probes.
- [x] **US-17 (Infrastructure as Code & Configuration Management)**: As a DevOps Engineer, I want an idempotent Ansible playbook (`ansible/playbook.yml`) and inventory that automates the provisioning of packages, users, directories, configurations, firewall ports, and system services for the Timesheet application.
- [x] **US-18 (Automated Provisioning & Reliability Validation)**: As a DevOps Engineer, I want automated validation tools to demonstrate Ansible idempotency (`changed=0` on re-run), multi-tier system health checks (`health-check.cmd` with 100% score), and disaster recovery/rollback (`rollback.cmd`) to previous stable releases with zero data loss.

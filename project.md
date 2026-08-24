PROJECT CONTEXT

Project Name:
Automated Timesheet Management Platform

Project Type:
A 15-week college DevOps project focused on developing a small web-based timesheet management system and progressively applying software development and DevOps practices.

STUDENT:
Aditya Chavan
Roll No: 23102B0006

==================================================
PROJECT PURPOSE
==================================================

The goal is to build an Automated Timesheet Management Platform where employees can record their working hours, managers can review and approve/reject timesheets, and administrators can manage users and view overall information.

The application should remain a SMALL, PRACTICAL MVP. Do not add unnecessary features that are not part of the assigned project scope.

==================================================
MAIN USERS
==================================================

1. Employee
   - Create timesheet records
   - View timesheets
   - Update timesheets
   - Search/filter timesheets
   - Submit timesheets for approval

2. Manager
   - View submitted employee timesheets
   - Approve timesheets
   - Reject timesheets

3. Admin
   - Manage users and roles
   - View system-level information

==================================================
MVP FEATURES
==================================================

The core application MVP must support:

- User/role management
- Create timesheet
- View timesheet
- Update timesheet
- Search/filter timesheets
- Role-based timesheet status workflow
- Summary dashboard

Timesheet status workflow:

DRAFT → SUBMITTED → APPROVED
↓
REJECTED

==================================================
TECHNOLOGY STACK
==================================================

Use this stack:

Frontend:

- React
- Vite

Backend:

- Java
- Spring Boot

Build Tool:

- Maven

Database:

- MySQL

API:

- REST API

Version Control:

- Git
- GitHub

Later DevOps tools:

- Jenkins
- Selenium
- Docker
- Ansible or Puppet

Deployment:

- Tomcat or Nginx, as required by the later assignment stages

==================================================
15-WEEK TASK DIVISION
==================================================

WEEK 1:
Problem Definition and Scope

Tasks:

- Study the real-time need for the Timesheet Management Platform
- Identify target users
- Identify pain points
- Identify stakeholders
- Identify constraints
- Define measurable success criteria
- Freeze the 15-week MVP scope

Deliverable:

- Problem statement
- Stakeholder list
- Objectives
- Constraints
- Approved MVP scope

WEEK 2:
Agile Planning and DevOps Workflow

Tasks:

- Create user stories
- Create acceptance criteria
- Prepare product backlog
- Prepare 15-week Scrum/Kanban plan
- Define Definition of Done
- Create DevOps lifecycle diagram

Deliverable:

- Product backlog
- Task board
- Sprint plan
- Definition of Done
- DevOps workflow diagram

WEEK 3:
Requirements, Architecture and Technology Setup

Tasks:

- Prepare SRS summary
- Design minimum application architecture
- Create use-case diagram
- Create architecture diagram
- Create data model
- Prepare API list
- Select technology stack
- Set up local development environment

MVP architecture should support:

- Create records
- View records
- Update records
- Search records
- Role-based status workflow
- Summary dashboard

Deliverable:

- SRS summary
- Use-case diagram
- Architecture diagram
- Data model
- API list
- Working local setup

WEEK 4:
Git and GitHub Repository Initialization

Tasks:

- Create GitHub repository
- Add README
- Add .gitignore
- Create folder structure
- Add issue templates
- Define branch naming rules
- Commit initial application skeleton
- Use meaningful commit messages

Deliverable:

- Repository URL
- README
- Initial commits
- Issues
- Branch policy

WEEK 5:
Feature Development with Branching

Tasks:

- Implement the first core workflow
- Work on a feature branch
- Practice add, commit, push, pull and git log
- Create pull request
- Review changes
- Merge into development branch

Deliverable:

- Working Feature 1
- Feature branch
- Pull request
- Review comments
- Merge evidence

WEEK 6:
MVP Completion and Git Collaboration

Tasks:
Complete the essential MVP:

- Create records
- View records
- Update records
- Search records
- Role-based status workflow
- Summary dashboard

Also:

- Create another feature branch
- Demonstrate merge conflict
- Resolve conflict
- Create release tag
- Update backlog

Deliverable:

- Functional MVP
- Resolved merge conflict
- Tagged version
- Updated backlog

WEEK 7:
Jenkins Installation and Continuous Integration

Tasks:

- Install Jenkins
- Configure Jenkins
- Connect GitHub repository
- Create Maven build job
- Trigger build through commit or polling
- Archive build artifact

Deliverable:

- Jenkins job
- Successful build log
- Trigger evidence
- Archived artifact

WEEK 8:
Pipeline as Code and Server Deployment

Tasks:

- Create Jenkinsfile
- Checkout source code
- Build project
- Package project
- Deploy application
- Parameterize at least one environment setting

Deliverable:

- Jenkinsfile
- Successful pipeline
- Deployed application
- Configuration evidence

WEEK 9:
Selenium Test Design and Local Execution

Tasks:

- Identify 3–5 critical user journeys
- Create Selenium WebDriver tests
- Add assertions
- Add test data
- Add failure screenshots
- Execute tests locally through Maven

Deliverable:

- Test plan
- Selenium scripts
- Local test report
- Failure screenshot mechanism

WEEK 10:
Continuous Testing in Jenkins

Tasks:

- Integrate Selenium tests into Jenkins
- Publish test reports
- Make failed tests stop deployment
- Introduce one deliberate defect
- Correct the defect
- Rerun pipeline

Deliverable:

- Jenkins test report
- Failed pipeline evidence
- Defect correction commit
- Successful rerun

WEEK 11:
Docker Image and Container Lifecycle

Tasks:

- Create Dockerfile
- Build Docker image
- Tag image
- Run container
- Map ports
- Inspect logs
- Stop/restart/remove containers
- Document lifecycle

Deliverable:

- Dockerfile
- Image details
- Docker command log
- Running container evidence

WEEK 12:
Jenkins-Docker Continuous Deployment

Tasks:

- Extend Jenkins pipeline
- Build versioned Docker image
- Publish to Docker Hub or local registry
- Deploy a fresh container automatically after successful tests

Deliverable:

- Versioned image
- Registry evidence
- End-to-end commit-to-container pipeline

WEEK 13:
Configuration Management Script

Tasks:
Identify and automate:

- Packages
- Users
- Folders
- Files
- Ports
- Services

Use either:

- Puppet
  OR
- Ansible

Deliverable:

- Configuration specification
- Puppet manifest OR Ansible inventory/playbook
- First execution log

WEEK 14:
Automated Provisioning and Reliability Validation

Tasks:

- Provision a clean target environment
- Deploy application/container
- Run automation again to demonstrate idempotency
- Perform health check
- Test rollback/recovery to previous stable release

Deliverable:

- Provisioned node
- Idempotency evidence
- Health-check result
- Rollback/recovery demonstration

WEEK 15:
Final End-to-End Release, Documentation and Viva

Tasks:
Run the complete workflow:

Git Commit
→ Jenkins Build
→ Selenium Quality Gate
→ Docker Deployment
→ Ansible/Puppet Provisioning

Also complete:

- Technical documentation
- Architecture documentation
- Troubleshooting guide
- Limitations
- Future enhancements
- Presentation
- Viva preparation

Deliverable:

- Final repository
- Live demonstration
- Complete report
- Screenshots/video
- Presentation
- Viva

==================================================
IMPORTANT DEVELOPMENT RULES
==================================================

1. Follow the 15-week plan strictly.
2. Do not introduce features that are not required by the plan.
3. Do not add email notifications, chat, payroll, attendance tracking, mobile apps, analytics, or other unrelated features.
4. Keep the MVP simple and suitable for a college project.
5. Build functionality progressively according to the assigned week.
6. Do not implement future-week DevOps functionality early unless specifically requested.
7. Use clean, understandable code suitable for explaining in a viva.
8. Prefer a simple architecture over unnecessary complexity.
9. Keep the application easy to run locally.
10. Every development decision should support the later Jenkins, Selenium, Docker, and Ansible/Puppet stages.

==================================================
CURRENT DEVELOPMENT STAGE
==================================================

Current stage: WEEK 3

At Week 3, focus only on:

- Requirements
- SRS
- Architecture
- Use cases
- Data model
- API design
- Technology setup
- Working local skeleton

The actual complete timesheet functionality will be developed primarily during Weeks 5 and 6.

When implementing anything, always check whether it belongs to the current week's task before adding it.

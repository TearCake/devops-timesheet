# 🎤 Professor Demo & Viva Presentation Guide

**Project**: Automated Timesheet Management Platform  
**Student**: Aditya Chavan (Roll No: 23102B0006)  
**Curriculum**: 15-Week DevOps Engineering Project  
**Repository**: `https://github.com/TearCake/devops-timesheet.git`  
**Live Services**:
- 🌐 **Frontend UI**: [http://localhost:8443](http://localhost:8443)
- 🐳 **Backend Container API**: [http://localhost:8085/api/timesheets](http://localhost:8085/api/timesheets)
- ⚙️ **Jenkins CI/CD Dashboard**: [http://localhost:9090](http://localhost:9090)

---

## ⏱️ Part 1: The 60-Second Elevator Pitch

> **Say this clearly and confidently when the professor says "Tell me about your project":**
>
> *"Good morning/afternoon, Professor. My project is the **Automated Timesheet Management Platform**, engineered over a comprehensive 15-week DevOps curriculum.*
> 
> *While the business application solves manual employee time-tracking using **React 19, Spring Boot 3, and MySQL**, the primary engineering focus is the **complete DevOps lifecycle surrounding it**.*
> 
> *I have implemented and automated:
> 1. **Git Branching & Release Governance** on GitHub with protected branches and merge conflict resolution.
> 2. **Pipeline as Code** in Jenkins using a declarative `Jenkinsfile`.
> 3. **Automated Continuous Testing & Quality Gates** using headless Selenium WebDriver 4 with automated screenshot capture on failures.
> 4. **Containerization & Continuous Deployment** with multi-stage Alpine Docker images and versioned tagging.
> 5. **Infrastructure as Code** using Ansible, where I have mathematically proven **100% idempotency** across 6 system domains.
> 6. **Reliability Engineering**, including an automated 5-tier health check suite and an instant disaster recovery rollback engine with zero data loss.*
> 
> *May I demonstrate the live application and pipeline stages?"*

---

## 🎬 Part 2: Step-by-Step Live Demo Sequence (7–10 Minutes)

Follow this exact sequence to give a flawless demonstration:

### Step 1: Demonstrate the Working Application (2 Minutes)
1. Open your browser and navigate to: **[http://localhost:8443](http://localhost:8443)**
2. Point out the green banner at the top:
   > *"Notice the connection banner: **`Connected to Docker container at localhost:8085`**. The React frontend automatically detects and binds to the containerized Spring Boot backend."*
3. Demonstrate the core business workflow:
   - Click **"+ Log New Entry"** ➔ enter date, select project, enter 8 hours, and save.
   - Show the new entry created in **`DRAFT`** status.
   - Click **"Submit"** ➔ status transitions to **`SUBMITTED`**.
   - Switch role to **"Manager View"** in the top navigation ➔ click **"Approve"** ➔ status transitions to **`APPROVED`**.
   - Click **"📥 Export CSV"** ➔ show the exported timesheet report downloading instantly.
4. Conclude this step:
   > *"All data persists live into MySQL through the containerized backend. Now let's examine the automated CI/CD pipeline that built and deployed this container."*

---

### Step 2: Demonstrate the Jenkins Pipeline as Code (2 Minutes)
1. Open your browser to Jenkins: **[http://localhost:9090](http://localhost:9090)**
2. Click on **`timesheet-pipeline`**.
3. Point to the **Stage View** and explain the lifecycle stages:
   ```text
   [Checkout] ➔ [Compile] ➔ [Tests & Quality Gate] ➔ [Package] ➔ [Build Docker Image] ➔ [Tag & Catalog] ➔ [Deploy Container] ➔ [Health Verification]
   ```
4. Key talking points to impress the professor:
   - *"The entire pipeline is codified in [`Jenkinsfile`](file:///c:/Coding/CLG/dev/Jenkinsfile) using declarative Groovy syntax committed directly to Git."*
   - *"In Stage 3, automated JUnit and headless Selenium WebDriver tests execute. If any test fails, the **Quality Gate** immediately halts the pipeline and prevents broken code from being packaged or deployed."*
   - Point out **Build #4 vs. Build #5 evidence** (documented in [`WEEK10_CONTINUOUS_TESTING.md`](file:///c:/Coding/CLG/dev/WEEK10_CONTINUOUS_TESTING.md)):
     > *"In Week 10, I demonstrated a deliberate UI defect in Build #4. The quality gate caught the failure, stopped deployment, and captured screenshot evidence. Build #5 was the verified fix that turned the pipeline green."*

---

### Step 3: Demonstrate Docker Continuous Deployment (1.5 Minutes)
1. Open your terminal in `C:\Coding\CLG\dev` and run:
   ```powershell
   docker images timesheet-backend
   ```
2. Explain the versioning convention:
   - `timesheet-backend:build-6` ➔ *Directly linked to Jenkins Build #6.*
   - `timesheet-backend:v1.2.6` ➔ *Semantic release tag for production cataloging.*
   - `timesheet-backend:latest` ➔ *Active rolling release.*
3. Highlight container optimization:
   > *"The container image is built on **Eclipse Temurin 17 JRE Alpine** using a multi-stage `Dockerfile`. Instead of a heavy 600MB+ full JDK image, this production image is optimized down to just **153MB**, running under an unprivileged `appuser` for security hardening."*

---

### Step 4: Demonstrate Infrastructure as Code & Ansible Idempotency (1.5 Minutes)
1. In your terminal, run the idempotency validation script:
   ```powershell
   .\ansible\validate-idempotency.cmd
   ```
   *(Or open [`ansible/idempotency-report.txt`](file:///c:/Coding/CLG/dev/ansible/idempotency-report.txt) to show the pre-computed audit log).*
2. Explain the results:
   > *"In Week 13 & 14, I automated 6 operating system domains with Ansible: Packages, Users, Folders, Files, Ports, and Services.*
   > 
   > *To prove **idempotency**, we executed the playbook twice on the same node:
   > - **Run 1**: Applied 7 initial configuration changes (`changed=7`).
   > - **Run 2**: Re-evaluated the exact same system and made **0 changes (`changed=0`)**.
   > This mathematically proves that our infrastructure code achieves the desired state without configuration drift."*

---

### Step 5: Demonstrate the Multi-Tier Health Check Suite (1 Minute)
1. In your terminal, run:
   ```powershell
   .\health-check.cmd
   ```
2. Watch the 5 inspection checks pass live:
   ```text
   [1/5] Docker Engine Status  : [PASS]
   [2/5] Container State       : [PASS] Running (timesheet-backend:build-6)
   [3/5] Backend REST API      : [PASS] HTTP 200 OK
   [4/5] Database Integrity    : [PASS] Active timesheet records returned
   [5/5] Frontend Web UI       : [PASS] Vite server active [HTTP 200]
   ========================================================================
   Overall Reliability Score   : 5/5 (100 percent) [HEALTHY - PRODUCTION READY]
   ========================================================================
   ```
3. Explain:
   > *"The script outputs an audited JSON report [`health-report.json`](file:///c:/Coding/CLG/dev/health-report.json) verifying full end-to-end system availability."*

---

### Step 6: Demonstrate Disaster Recovery & Instant Rollback (1.5 Minutes)
1. Tell the professor:
   > *"Now I will demonstrate our automated rollback engine. If an unstable build is ever deployed, we can revert to a previous stable release in seconds."*
2. Run live in terminal:
   ```powershell
   .\rollback.cmd 1.0.0
   ```
3. Watch the engine automatically stop the container, deploy release `1.0.0`, probe health until HTTP 200, and generate [`rollback-manifest.json`](file:///c:/Coding/CLG/dev/rollback-manifest.json) in under **6 seconds**!
4. Point out the zero data loss guarantee:
   > *"Notice that even though the container was replaced, our database data remains 100% intact because the relational data lives independently in MySQL on host port 3306, decoupled from the ephemeral container."*
5. Restore back to latest build:
   ```powershell
   .\rollback.cmd build-6
   ```

---

## 🧠 Part 3: Top 15 Viva Questions & Winning Answers

Here are the questions professors frequently ask, along with the exact technical answers:

#### Q1: What is the core difference between CI and CD in your project?
> **Answer**:  
> *"Continuous Integration (CI) automatically builds code, compiles Java sources with Maven, and runs our JUnit and Selenium tests on every commit to catch defects early.  
> Continuous Deployment (CD) takes the verified artifact, builds a versioned Docker image (`timesheet-backend:build-N`), catalogs it, and automatically redeploys the live container on port 8085 with health-check verification without manual human intervention."*

#### Q2: Why did you use Selenium in "headless" mode inside Jenkins?
> **Answer**:  
> *"In a continuous integration environment like Jenkins or a remote Linux server, there is no physical monitor or X11 graphical display. Running Chrome or Edge in headless mode (`--headless=new`) allows the browser engine to execute full DOM rendering, JavaScript execution, and click simulations in memory without requiring a GUI display."*

#### Q3: How did your Quality Gate prevent broken deployments?
> **Answer**:  
> *"In [`Jenkinsfile`](file:///c:/Coding/CLG/dev/Jenkinsfile), the `Automated Tests & Quality Gate` stage executes `mvn test`. If any Selenium or JUnit assertion fails, Maven returns an exit code of `1`. Jenkins catches this non-zero exit code, immediately marks the build as FAILED, aborts subsequent packaging and Docker deployment stages, and archives failure screenshots via `ScreenshotExtension.java` for debugging."*

#### Q4: What is the significance of using Alpine Linux for your Docker base image?
> **Answer**:  
> *"A standard Ubuntu or full JDK image is between 600MB to 1GB and contains unnecessary compilers, packages, and attack surface. By using `eclipse-temurin:17-jre-alpine`, we only include the lightweight Alpine kernel and the minimal JRE needed to run our pre-packaged JAR. This reduced our container image size down to **153MB**, sped up deployment time, and significantly minimized security vulnerabilities."*

#### Q5: What is Idempotency in Ansible and why is it important?
> **Answer**:  
> *"Idempotency is the property where an operation can be applied multiple times without changing the result beyond the initial application. In our project, running [`ansible/playbook.yml`](file:///c:/Coding/CLG/dev/ansible/playbook.yml) the first time made 7 system modifications (`changed=7`). Running it a second time on the same node produced **`changed=0`**, meaning Ansible confirmed the system was already in the desired state. This prevents accidental overwriting of configs or repeated service restarts."*

#### Q6: How does your container connect to MySQL running on the host?
> **Answer**:  
> *"When running the Docker container on Windows/Linux, the container runs in an isolated network namespace. We use the flag `--add-host=host.docker.internal:host-gateway` and configure the Spring Boot JDBC URL to `jdbc:mysql://host.docker.internal:3306/timesheet_db`. This routes database traffic through the Docker bridge directly to the host's MySQL port 3306."*

#### Q7: How does your rollback mechanism guarantee zero data loss?
> **Answer**:  
> *"Our architecture strictly adheres to cloud-native 12-factor principles: the application container is **stateless**, while state is stored externally in MySQL. When [`rollback.cmd`](file:///c:/Coding/CLG/dev/rollback.cmd) destroys and recreates the container image, it reconnects to the existing MySQL database on port 3306. Thus, all timesheets, projects, and user records remain completely intact."*

#### Q8: What Git branching strategy did you follow?
> **Answer**:  
> *"We followed the GitFlow model documented in [`BRANCHING_STRATEGY.md`](file:///c:/Coding/CLG/dev/BRANCHING_STRATEGY.md):  
> - `main`: Production-ready releases, tagged with semantic version numbers (e.g. `v0.1.0-mvp`, `v1.0.0-final`).  
> - `develop`: Integration branch where all sprint features are merged and tested.  
> - `feature/*`: Dedicated branches for each week's deliverables (e.g. `feature/week12-jenkins-docker-cd`), merged into `develop` via pull requests."*

#### Q9: What happens if the database goes down while the application is running?
> **Answer**:  
> *"Our [`health-check.cmd`](file:///c:/Coding/CLG/dev/health-check.cmd) actively probes the `/api/timesheets` endpoint and validates the JSON payload. If MySQL stops, Spring Boot returns an HTTP 500 error or connection failure. The health check detects this, drops the score from 5/5 to degraded, and alerts the operator via the generated `health-report.json`."*

#### Q10: Why did you choose Ansible over Puppet?
> **Answer**:  
> *"Ansible is agentless and communicates over standard SSH, whereas Puppet requires installing and maintaining a heavy background daemon (`puppet-agent`) on every managed node. Furthermore, Ansible playbooks are written in clean, human-readable YAML, making them easier to manage, audit, and version control."*

---

## 🚨 Part 4: Emergency Quick-Start Commands (If Anything is Closed)

If any window was accidentally closed before your presentation, run these quick commands in PowerShell:

```powershell
# 1. Start Jenkins CI Server (Port 9090):
cmd /c .\start-jenkins.cmd

# 2. Start Docker Backend Container (Port 8085):
docker start timesheet-app

# 3. Start Frontend UI (Port 8443):
npm run dev

# 4. Verify All Services in 3 seconds:
.\health-check.cmd
```

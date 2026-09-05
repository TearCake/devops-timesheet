# 🚀 Jenkins Pipeline as Code & Deployment Guide (Week 8)

**Project**: Automated Timesheet Management Platform  
**Port**: `http://localhost:9090`  
**GitHub Repository**: `https://github.com/TearCake/devops-timesheet.git`  
**Pipeline Definition**: `Jenkinsfile` (Declarative Pipeline)

---

## 📌 Overview

In **Week 8**, continuous integration is upgraded from a manual Freestyle job to **Pipeline as Code**. The entire build, test, package, and deployment lifecycle is codified in [`Jenkinsfile`](file:///c:/Coding/CLG/dev/Jenkinsfile) and committed directly to the Git repository.

### Pipeline Stages

```text
[Checkout & Validate] ──▶ [Build (Compile)] ──▶ [Automated Tests] ──▶ [Package Artifact] ──▶ [Deploy Application] ──▶ [Deployment Verification]
```

### Parameterized Environment Settings

| Parameter | Type | Default | Description |
| :--- | :---: | :---: | :--- |
| `ENVIRONMENT` | Choice | `dev` | Target environment (`dev`, `staging`, `production`) |
| `SERVER_PORT` | String | `8080` | Port for the application server instance |
| `RUN_TESTS` | Boolean | `true` | Executes JUnit 5 unit & lifecycle test suite |
| `AUTO_DEPLOY` | Boolean | `true` | Executes deployment script to local server directory |

---

## 🛠️ Step-by-Step Setup in Jenkins

### 1. Ensure Jenkins Server is Running
- Jenkins runs at **[http://localhost:9090](http://localhost:9090)**.
- If Jenkins ever needs to be started, double-click [`start-jenkins.cmd`](file:///c:/Coding/CLG/dev/start-jenkins.cmd).

### 2. Create the Pipeline Job
1. Open **[http://localhost:9090](http://localhost:9090)** in your browser.
2. Click **New Item** on the left sidebar.
3. Enter Item Name: **`timesheet-pipeline`**.
4. Select **Pipeline** (the icon with multiple colored workflow stages).
5. Click **OK**.

### 3. Configure Pipeline from SCM
1. In the job configuration page, scroll down to the **Pipeline** section.
2. Change **Definition** to: **`Pipeline script from SCM`**.
3. Under **SCM**, select: **`Git`**.
4. **Repository URL**:
   ```text
   https://github.com/TearCake/devops-timesheet.git
   ```
5. **Branch Specifier**:
   ```text
   */develop
   ```
   *(or `*/main`)*
6. **Script Path**:
   ```text
   Jenkinsfile
   ```
7. Click **Save**.

---

## ▶️ Triggering the Pipeline & Verifying Results

### 1. Trigger the First Build
> **Note**: On the very first run, Jenkins reads the `Jenkinsfile` to register the build parameters.
1. Click **Build Now** (or **Build with Parameters** once initialized).
2. Choose your parameters:
   - `ENVIRONMENT`: `dev`
   - `SERVER_PORT`: `8080`
   - `RUN_TESTS`: Checked (`true`)
   - `AUTO_DEPLOY`: Checked (`true`)
3. Click **Build**.

### 2. Verify Stages in Stage View
On the job dashboard, observe the **Stage View** table displaying each stage in green:
- ✅ **Checkout & Validate**: Clones repo and validates environment.
- ✅ **Build (Compile)**: Compiles Java source files via Maven.
- ✅ **Automated Tests**: Runs JUnit 5 test suite (`TimesheetTest` - 3 passed).
- ✅ **Package Artifact**: Assembles `timesheet-backend-0.0.1-SNAPSHOT.jar` and archives it in Jenkins.
- ✅ **Deploy Application**: Copies artifact into `timesheet-management/deploy/current/` and generates `deployment-manifest.json`.
- ✅ **Deployment Verification**: Prints the deployment manifest into the build log.

### 3. Verify Deployed Artifact & Manifest
The deployed application and its deployment manifest are written to:
- Manifest: [`timesheet-management/deploy/current/deployment-manifest.json`](file:///c:/Coding/CLG/dev/timesheet-management/deploy/current/deployment-manifest.json)
- Deployed Binary: `timesheet-management/deploy/current/timesheet-backend.jar`
- Standalone Runner: [`timesheet-management/deploy/run-deployed.cmd`](file:///c:/Coding/CLG/dev/timesheet-management/deploy/run-deployed.cmd)

---

## 🎯 Week 8 Deliverables Checklist

- [x] Declarative [`Jenkinsfile`](file:///c:/Coding/CLG/dev/Jenkinsfile) at repository root.
- [x] Source code checkout from GitHub repository.
- [x] Maven compilation and packaging stages.
- [x] Automated unit test quality gate (`mvn test`).
- [x] Parameterized settings (`ENVIRONMENT`, `SERVER_PORT`).
- [x] Automated deployment stage and manifest generation.
- [x] Artifact archiving (`*.jar`).

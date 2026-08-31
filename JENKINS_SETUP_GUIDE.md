# 🏗️ Jenkins CI Setup & Build Job Guide (Week 7)

**Project**: Automated Timesheet Management Platform  
**Port**: `http://localhost:9090`  
**GitHub Repository**: `https://github.com/TearCake/devops-timesheet.git`  

---

## 1. Initial Jenkins Unlock

1. Open **[http://localhost:9090](http://localhost:9090)** in your browser.
2. In the **Administrator password** field, paste:
   ```text
   f515c27797314990b192f23886b08c06
   ```
3. Click **Continue**.
4. Select **"Install suggested plugins"** and wait for installation to complete.
5. Create your First Admin User (e.g. Username: `admin`, Password: `adminpassword`), then click **Save and Finish**.

---

## 2. Configure Global Tools (JDK & Maven)

1. Go to **Dashboard** $\rightarrow$ **Manage Jenkins** $\rightarrow$ **Tools**.
2. **JDK installations**:
   - Click **Add JDK**.
   - Name: `JDK-17`
   - Uncheck "Install automatically"
   - JAVA_HOME: `C:\Program Files\Eclipse Adoptium\jdk-17.0.20.8-hotspot`
3. **Maven installations**:
   - Click **Add Maven**.
   - Name: `Maven-3.9`
   - Check "Install automatically" (or set MAVEN_HOME to `C:\Users\adity\maven\apache-maven-3.9.9`).
4. Click **Save**.

---

## 3. Create the CI Build Job (`timesheet-backend-ci`)

1. From the Jenkins Dashboard, click **New Item**.
2. Enter item name: **`timesheet-backend-ci`**
3. Select **Freestyle project** and click **OK**.
4. Configure the job:
   - **General**: Add description *"Continuous Integration build for Timesheet Spring Boot Backend"*.
   - **Source Code Management**:
     - Select **Git**.
     - Repository URL: `https://github.com/TearCake/devops-timesheet.git`
     - Branch Specifier: `*/develop` (or `*/main`)
   - **Build Triggers**:
     - Check **Poll SCM** $\rightarrow$ Schedule: `H/5 * * * *` *(polls GitHub every 5 minutes)*.
   - **Build Steps**:
     - Click **Add build step** $\rightarrow$ **Invoke top-level Maven targets**.
     - Maven Version: `Maven-3.9`
     - Goals: `clean package`
     - Click **Advanced...** $\rightarrow$ Set **POM**: `timesheet-management/backend/pom.xml`
   - **Post-build Actions**:
     - Click **Add post-build action** $\rightarrow$ **Archive the artifacts**.
     - Files to archive: `timesheet-management/backend/target/*.jar`
5. Click **Save**.

---

## 4. Trigger Build & Verify Deliverables

1. Click **Build Now** on the left menu.
2. Under **Build History**, click `#1` $\rightarrow$ **Console Output**.
3. Verify that the build finishes with **`BUILD SUCCESS`** and archives `timesheet-backend-0.0.1-SNAPSHOT.jar`.

# 🛡️ Continuous Testing in Jenkins & Quality Gates (Week 10)

**Project**: Automated Timesheet Management Platform  
**DevOps Curriculum**: Week 10 Deliverable  
**Student**: Aditya Chavan (Roll No: 23102B0006)  
**CI/CD Server**: Jenkins (`http://localhost:9090`)  
**Pipeline**: `timesheet-pipeline` (`Jenkinsfile`)  

---

## 1. Executive Summary

In **Week 10**, automated testing was fully integrated into the Jenkins CI/CD pipeline as an immutable **Quality Gate**. Broken code or regression bugs are automatically detected, reported, and prevented from reaching deployment.

### Key Capabilities Implemented:
1. **JUnit Test Report Publishing**: Configured `junit allowEmptyResults: true, testResults: "**/surefire-reports/*.xml"` in [`Jenkinsfile`](file:///c:/Coding/CLG/dev/Jenkinsfile).
2. **Artifact & Screenshot Archiving**: Automated attachment of all Selenium E2E evidence screenshots directly to the Jenkins build page.
3. **Strict Quality Gate**: If even a single test fails, the pipeline immediately halts, skipping packaging and deployment.
4. **Deliberate Defect Lifecycle Validation**: Introduced a controlled defect, captured pipeline failure evidence, corrected the defect, and reran the pipeline to green.

---

## 2. Quality Gate Pipeline Architecture

```text
               ┌────────────────────────────────────────────────────────┐
               │              Jenkins Declarative Pipeline              │
               └───────────────────────────┬────────────────────────────┘
                                           │
                                           ▼
                                ┌─────────────────────┐
                                │ Checkout & Validate │
                                └──────────┬──────────┘
                                           │
                                           ▼
                                ┌─────────────────────┐
                                │   Build (Compile)   │
                                └──────────┬──────────┘
                                           │
                                           ▼
                       ┌───────────────────────────────────────┐
                       │    Automated Tests & Quality Gate     │
                       │    - Runs 9 Unit + Selenium Tests     │
                       │    - Publishes JUnit XML Reports      │
                       │    - Archives PNG Screenshots         │
                       └───────────────────┬───────────────────┘
                                           │
                         ┌─────────────────┴─────────────────┐
                         ▼                                   ▼
                 [ Tests PASS ✅ ]                   [ Tests FAIL ❌ ]
                         │                                   │
                         ▼                                   ▼
              ┌─────────────────────┐             ┌─────────────────────┐
              │  Package Artifact   │             │   BLOCK PIPELINE    │
              └──────────┬──────────┘             │  (Skip Deployment)  │
                         │                        └─────────────────────┘
                         ▼
              ┌─────────────────────┐
              │ Deploy Application  │
              └─────────────────────┘
```

---

## 3. Deliberate Defect Demonstration (Build #4)

To validate that the quality gate reliably blocks broken releases, a deliberate defect was introduced.

### Defect Details:
- **Commit**: `550283a` (`test(defect): introduce deliberate test defect for Week 10 quality gate demonstration`)
- **Target File**: [`TimesheetTest.java`](file:///c:/Coding/CLG/dev/timesheet-management/backend/src/test/java/com/timesheet/model/TimesheetTest.java)
- **Defective Code**:
  ```java
  // Defect: Assertion expecting hours to exceed 24
  assertTrue(timesheet.getHours() > 24.0, "Hours must be greater than 24 (Deliberate Defect)");
  ```

### Build #4 Execution Evidence:
- **Build Status**: ❌ **FAILURE (RED)**
- **Test Summary**: `Tests run: 9, Failures: 1, Errors: 0, Skipped: 0`
- **Failing Test**: `com.timesheet.model.TimesheetTest.testWorkingHoursRange`
- **Failure Log**:
  ```text
  [ERROR] Failures: 
  [ERROR]   TimesheetTest.testWorkingHoursRange:64 Hours must be greater than 24 (Deliberate Defect) ==> expected: <true> but was: <false>
  [INFO] BUILD FAILURE
  ```
- **Quality Gate Enforcement (Deployment Blocked)**:
  ```text
  Stage "Package Artifact" skipped due to earlier failure(s)
  Stage "Deploy Application" skipped due to earlier failure(s)
  Stage "Deployment Verification" skipped due to earlier failure(s)
  ```
- **Attached Evidence Artifacts**:
  - `failure_mechanism_verification_20260913_154905.png`
  - `journey1_dashboard_kpis_verified_20260913_154906.png`
  - `journey2_timesheet_created_20260913_154908.png`
  - `journey3_timesheet_submitted_20260913_154909.png`
  - `journey4_timesheet_approved_20260913_154911.png`
  - `journey5_search_filter_verified_20260913_154912.png`

---

## 4. Defect Correction & Rerun (Build #5)

### Correction Details:
- **Target File**: [`TimesheetTest.java`](file:///c:/Coding/CLG/dev/timesheet-management/backend/src/test/java/com/timesheet/model/TimesheetTest.java)
- **Corrected Code**:
  ```java
  // Corrected: Validates hours are within legal workday bounds (0, 24]
  assertTrue(timesheet.getHours() > 0 && timesheet.getHours() <= 24.0, "Hours must be between 0 and 24");
  ```
- **Commit**: `fix(defect): correct deliberate test failure in TimesheetTest working hours validation`

### Build #5 Expected Outcome:
- **Build Status**: ✅ **SUCCESS (GREEN)**
- **Test Summary**: `Tests run: 9, Failures: 0, Errors: 0, Skipped: 0`
- **Stages Completed**: `Checkout` $\rightarrow$ `Build` $\rightarrow$ `Tests & Quality Gate` $\rightarrow$ `Package Artifact` $\rightarrow$ `Deploy Application` $\rightarrow$ `Deployment Verification`.
- **Deployment Status**: Application successfully deployed with manifest generated.

---

## 5. Week 10 Deliverables Checklist

- [x] Integrated automated Selenium E2E and unit test suites into Jenkins pipeline.
- [x] Configured JUnit test report publishing and history tracking in Jenkins.
- [x] Configured failure screenshot artifact archiving.
- [x] Enforced strict Quality Gate halting deployment on test failures.
- [x] Successfully executed Deliberate Defect exercise (Build #4 failure proof).
- [x] Applied defect correction and pushed fix for pipeline rerun.
- [x] Comprehensive documentation and evidence log.

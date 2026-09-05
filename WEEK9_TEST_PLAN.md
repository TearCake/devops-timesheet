# 🧪 Selenium Test Automation Plan & Report (Week 9)

**Project**: Automated Timesheet Management Platform  
**DevOps Curriculum**: Week 9 Deliverable  
**Student**: Aditya Chavan (Roll No: 23102B0006)  
**Test Framework**: Selenium WebDriver 4, WebDriverManager, JUnit 5, Java 17  
**Test Runner**: Apache Maven Surefire  

---

## 1. Objectives & Testing Scope

The primary objective of **Week 9** is to design, implement, and locally execute automated browser tests covering the core user journeys of the Automated Timesheet Management Platform.

### Scope:
- **Critical User Journeys**: End-to-end UI verification of timesheet logging, status workflow (`DRAFT` $\rightarrow$ `SUBMITTED` $\rightarrow$ `APPROVED`), role switching, searching, and KPI analytics.
- **Cross-Browser & Headless Execution**: Tests execute in headless Chrome (with automatic fallback to Microsoft Edge), ensuring speed, consistency, and CI readiness for Jenkins (Week 10).
- **Failure Diagnostics**: Automated failure screenshot mechanism capturing timestamped `.png` images on test failures or checkpoints.
- **Local Maven Execution**: Triggered via `mvn test` producing Surefire XML and text reports.

---

## 2. Test Architecture

```text
               ┌────────────────────────────────────────────────────────┐
               │              Maven Surefire Test Runner                │
               └───────────────────────────┬────────────────────────────┘
                                           │
                    ┌──────────────────────┴──────────────────────┐
                    ▼                                             ▼
       ┌─────────────────────────┐                   ┌─────────────────────────┐
       │   TimesheetTest (Unit)  │                   │ TimesheetE2ETest (E2E)  │
       │   - Model attributes    │                   │ - 5 Critical Journeys   │
       │   - Status enum logic   │                   │ - Browser automation    │
       │   - Working hours range │                   │ - UI assertions         │
       └─────────────────────────┘                   └─────────────┬───────────┘
                                                                   │
                                     ┌─────────────────────────────┼─────────────────────────────┐
                                     ▼                             ▼                             ▼
                        ┌─────────────────────────┐   ┌─────────────────────────┐   ┌─────────────────────────┐
                        │   BaseSeleniumTest      │   │  ScreenshotExtension    │   │  Embedded Test Server   │
                        │   - Headless Chrome/Edge│   │  - Auto-captures .png   │   │  - Ephemeral port       │
                        │   - Lifecycle management│   │  - Saves to target/     │   │  - Serves test UI       │
                        └─────────────────────────┘   └─────────────────────────┘   └─────────────────────────┘
```

---

## 3. Critical User Journeys (5 Test Cases)

| Journey # | User Story | Journey Name | Test Method | Key Assertions & Validations |
| :---: | :--- | :--- | :--- | :--- |
| **UJ-01** | US-07 | **Dashboard KPI Metrics** | `testJourney1_DashboardKpisAndSummaryCards` | - Page title matches `Timesheet Management Platform`<br>- 4 KPI cards present: Hours logged, Pending approval, Approved, Active projects<br>- Active projects count equals `3` |
| **UJ-02** | US-01 | **Employee Timesheet Creation** | `testJourney2_EmployeeCreatesTimesheetDraft` | - Click `+ Log Time` opens modal<br>- Select project "Mobile App", enter `7.5` hrs, description<br>- Assert banner confirms `created as DRAFT successfully`<br>- Assert new row appears in table with `DRAFT` status |
| **UJ-03** | US-04 | **Employee Submits Timesheet** | `testJourney3_EmployeeSubmitsTimesheetForApproval` | - Timesheet #3 initially in `DRAFT` state<br>- Click `Submit` button<br>- Assert banner confirms `submitted for manager review`<br>- Assert row status badge transitions to `SUBMITTED` |
| **UJ-04** | US-05 | **Manager Review & Approval** | `testJourney4_ManagerReviewsAndApprovesTimesheet` | - Switch role to `MANAGER`<br>- Locate `SUBMITTED` timesheet #2<br>- Click `Approve` button<br>- Assert banner confirms `has been APPROVED`<br>- Assert row status badge updates to `APPROVED` |
| **UJ-05** | US-06 | **Keyword Search & Status Filter** | `testJourney5_SearchAndStatusFilter` | - Select status filter `APPROVED` $\rightarrow$ verify all rows have `APPROVED` badge<br>- Reset filter, search keyword `database` $\rightarrow$ verify exactly 1 matching row displayed |

---

## 4. Failure Screenshot Mechanism

Implemented in [`ScreenshotExtension.java`](file:///c:/Coding/CLG/dev/timesheet-management/backend/src/test/java/com/timesheet/e2e/ScreenshotExtension.java) using JUnit 5 `TestWatcher`:
- **Automatic Trigger**: If any assertion or step throws an exception, `testFailed()` intercepts the event.
- **Storage Location**: `timesheet-management/backend/target/screenshots/`
- **Naming Pattern**: `<test_name>_<timestamp>.png`
- **Output Evidence**:
  - `failure_mechanism_verification_20260905_194412.png` (49.5 KB)
  - `journey1_dashboard_kpis_verified_20260905_194413.png` (49.5 KB)
  - `journey2_timesheet_created_20260905_194415.png` (59.5 KB)
  - `journey3_timesheet_submitted_20260905_194416.png` (53.8 KB)
  - `journey4_timesheet_approved_20260905_194418.png` (55.0 KB)
  - `journey5_search_filter_verified_20260905_194419.png` (39.0 KB)

---

## 5. Execution & Verification Results

### Execution Command:
```bash
mvn test -f timesheet-management/backend/pom.xml
```

*(To run in headed mode and watch the browser open: `mvn test -Dheadless=false -f timesheet-management/backend/pom.xml`)*

### Test Results Summary:
```text
-------------------------------------------------------
 T E S T S
-------------------------------------------------------
Running com.timesheet.e2e.FailureScreenshotTest
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 7.052 s

Running com.timesheet.e2e.TimesheetE2ETest
[INFO] Tests run: 5, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 7.290 s

Running com.timesheet.model.TimesheetTest
[INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.024 s

Results:
Tests run: 9, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
```

---

## 6. Week 9 Deliverables Checklist

- [x] Identified 5 critical user journeys with complete acceptance criteria.
- [x] Implemented automated Selenium WebDriver scripts with Selenium 4 & WebDriverManager.
- [x] Robust assertion strategy covering text, element visibility, row counts, and badge statuses.
- [x] Test data and fixtures for employees, managers, projects, and timesheets.
- [x] Automated failure screenshot mechanism saving `.png` images to `target/screenshots/`.
- [x] Local Maven execution verified (`9/9 tests passed, 0 failures`).
- [x] Comprehensive Test Plan & Report documentation.

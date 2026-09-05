package com.timesheet.e2e;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Week 9 Selenium E2E Test Suite.
 * Automates 5 critical user journeys with validations and evidence screenshots.
 */
@DisplayName("Week 9: Selenium WebDriver E2E Automated Tests")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class TimesheetE2ETest extends BaseSeleniumTest {

    @Test
    @Order(1)
    @DisplayName("Journey 1: Verify Dashboard KPI Metric Cards & Platform Header")
    void testJourney1_DashboardKpisAndSummaryCards() {
        openApp();

        WebElement title = driver.findElement(By.id("page-title"));
        assertEquals("Timesheet Management Platform", title.getText());

        WebElement valHours = driver.findElement(By.id("val-hours"));
        WebElement valPending = driver.findElement(By.id("val-pending"));
        WebElement valApproved = driver.findElement(By.id("val-approved"));
        WebElement valProjects = driver.findElement(By.id("val-projects"));

        assertNotNull(valHours.getText());
        assertFalse(valHours.getText().isBlank(), "Hours counter should not be empty");
        assertNotNull(valPending.getText());
        assertNotNull(valApproved.getText());
        assertEquals("3", valProjects.getText());

        takeScreenshot("journey1_dashboard_kpis_verified");
    }

    @Test
    @Order(2)
    @DisplayName("Journey 2: Employee Creates New Timesheet Entry (DRAFT state)")
    void testJourney2_EmployeeCreatesTimesheetDraft() {
        openApp();
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));

        // Click create button
        WebElement createBtn = driver.findElement(By.id("btn-create-timesheet"));
        createBtn.click();

        // Wait for modal
        WebElement modal = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("create-modal")));
        assertTrue(modal.isDisplayed());

        // Fill form
        Select projectSelect = new Select(driver.findElement(By.id("project-select")));
        projectSelect.selectByValue("2"); // Mobile App

        WebElement hoursInput = driver.findElement(By.id("timesheet-hours"));
        hoursInput.clear();
        hoursInput.sendKeys("7.5");

        WebElement descInput = driver.findElement(By.id("timesheet-description"));
        descInput.sendKeys("Automated Selenium E2E creation test");

        // Submit form
        WebElement saveBtn = driver.findElement(By.id("btn-save-timesheet"));
        saveBtn.click();

        // Verify notification banner
        WebElement banner = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("status-banner")));
        assertTrue(banner.getText().contains("created as DRAFT successfully"));

        // Verify record in table
        WebElement descCell = driver.findElement(By.xpath("//td[contains(text(),'Automated Selenium E2E creation test')]"));
        assertNotNull(descCell);

        WebElement hoursCell = driver.findElement(By.xpath("//td[contains(text(),'7.5 hrs')]"));
        assertNotNull(hoursCell);

        takeScreenshot("journey2_timesheet_created");
    }

    @Test
    @Order(3)
    @DisplayName("Journey 3: Employee Submits DRAFT Timesheet for Manager Review")
    void testJourney3_EmployeeSubmitsTimesheetForApproval() {
        openApp();
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));

        // Timesheet #3 is initially in DRAFT state
        WebElement statusBadge = driver.findElement(By.id("row-status-3"));
        assertEquals("DRAFT", statusBadge.getText());

        // Click submit button for item #3
        WebElement submitBtn = driver.findElement(By.id("btn-submit-3"));
        submitBtn.click();

        // Verify banner
        WebElement banner = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("status-banner")));
        assertTrue(banner.getText().contains("submitted for manager review"));

        // Verify status badge updated to SUBMITTED
        WebElement updatedBadge = driver.findElement(By.id("row-status-3"));
        assertEquals("SUBMITTED", updatedBadge.getText());

        takeScreenshot("journey3_timesheet_submitted");
    }

    @Test
    @Order(4)
    @DisplayName("Journey 4: Manager Reviews and Approves Submitted Timesheet")
    void testJourney4_ManagerReviewsAndApprovesTimesheet() {
        openApp();
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));

        // Switch role to MANAGER
        WebElement roleBtn = driver.findElement(By.id("role-toggle-btn"));
        roleBtn.click();

        WebElement roleLabel = driver.findElement(By.id("current-role"));
        assertEquals("MANAGER", roleLabel.getText());

        // Timesheet #2 is initially SUBMITTED
        WebElement statusBefore = driver.findElement(By.id("row-status-2"));
        assertEquals("SUBMITTED", statusBefore.getText());

        // Click Approve button
        WebElement approveBtn = wait.until(ExpectedConditions.elementToBeClickable(By.id("btn-approve-2")));
        approveBtn.click();

        // Verify banner and updated status
        WebElement banner = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("status-banner")));
        assertTrue(banner.getText().contains("has been APPROVED"));

        WebElement statusAfter = driver.findElement(By.id("row-status-2"));
        assertEquals("APPROVED", statusAfter.getText());

        takeScreenshot("journey4_timesheet_approved");
    }

    @Test
    @Order(5)
    @DisplayName("Journey 5: Search Filter by Keyword and Status Dropdown")
    void testJourney5_SearchAndStatusFilter() {
        openApp();

        // Filter by APPROVED status
        Select statusSelect = new Select(driver.findElement(By.id("status-filter")));
        statusSelect.selectByValue("APPROVED");

        List<WebElement> rows = driver.findElements(By.xpath("//tbody[@id='timesheet-rows']/tr"));
        assertFalse(rows.isEmpty(), "Table should have filtered rows");

        for (WebElement row : rows) {
            WebElement badge = row.findElement(By.xpath(".//span[contains(@class,'badge')]"));
            assertEquals("APPROVED", badge.getText(), "Filtered row should have APPROVED status");
        }

        // Reset filter and test keyword search
        statusSelect.selectByValue("ALL");
        WebElement searchInput = driver.findElement(By.id("search-input"));
        searchInput.clear();
        searchInput.sendKeys("database");

        List<WebElement> filteredRows = driver.findElements(By.xpath("//tbody[@id='timesheet-rows']/tr"));
        assertEquals(1, filteredRows.size(), "Only 1 matching timesheet should appear for 'database'");

        WebElement desc = driver.findElement(By.id("row-desc-3"));
        assertTrue(desc.getText().contains("Database schema migration"));

        takeScreenshot("journey5_search_filter_verified");
    }
}

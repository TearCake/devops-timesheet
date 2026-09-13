package com.timesheet.model;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Timesheet Model & Lifecycle Unit Tests")
class TimesheetTest {

    @Test
    @DisplayName("Should create timesheet and verify fields")
    void testTimesheetFields() {
        Timesheet timesheet = new Timesheet();
        timesheet.setTimesheetId(101L);
        timesheet.setUserId(1L);
        timesheet.setProjectId(2L);
        timesheet.setDate(LocalDate.of(2026, 9, 5));
        timesheet.setHours(7.5);
        timesheet.setDescription("Implemented declarative Jenkinsfile pipeline");
        timesheet.setStatus(TimesheetStatus.DRAFT);

        assertEquals(101L, timesheet.getTimesheetId());
        assertEquals(1L, timesheet.getUserId());
        assertEquals(2L, timesheet.getProjectId());
        assertEquals(LocalDate.of(2026, 9, 5), timesheet.getDate());
        assertEquals(7.5, timesheet.getHours());
        assertEquals("Implemented declarative Jenkinsfile pipeline", timesheet.getDescription());
        assertEquals(TimesheetStatus.DRAFT, timesheet.getStatus());
    }

    @Test
    @DisplayName("Should support full status workflow lifecycle (DRAFT -> SUBMITTED -> APPROVED / REJECTED)")
    void testStatusLifecycleWorkflow() {
        Timesheet timesheet = new Timesheet();
        timesheet.setStatus(TimesheetStatus.DRAFT);
        assertEquals(TimesheetStatus.DRAFT, timesheet.getStatus());

        // Employee submits
        timesheet.setStatus(TimesheetStatus.SUBMITTED);
        assertEquals(TimesheetStatus.SUBMITTED, timesheet.getStatus());

        // Manager approves
        timesheet.setStatus(TimesheetStatus.APPROVED);
        assertEquals(TimesheetStatus.APPROVED, timesheet.getStatus());

        // Or manager rejects
        timesheet.setStatus(TimesheetStatus.REJECTED);
        assertEquals(TimesheetStatus.REJECTED, timesheet.getStatus());
    }

    @Test
    @DisplayName("Should verify valid working hours range")
    void testWorkingHoursRange() {
        Timesheet timesheet = new Timesheet();
        timesheet.setHours(8.0);
        assertTrue(timesheet.getHours() > 0 && timesheet.getHours() <= 24.0, "Hours must be between 0 and 24");
    }
}

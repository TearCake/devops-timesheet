package com.timesheet.model;

/**
 * Lifecycle states of a timesheet entry.
 * Week 3: enum only, no transition rules implemented yet.
 */
public enum TimesheetStatus {
    DRAFT,
    SUBMITTED,
    APPROVED,
    REJECTED
}

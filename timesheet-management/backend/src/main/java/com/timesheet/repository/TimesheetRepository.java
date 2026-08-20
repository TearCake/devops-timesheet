package com.timesheet.repository;

import com.timesheet.model.Timesheet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Placeholder repository for Timesheet. Week 3: basic CRUD only.
 */
@Repository
public interface TimesheetRepository extends JpaRepository<Timesheet, Long> {
}

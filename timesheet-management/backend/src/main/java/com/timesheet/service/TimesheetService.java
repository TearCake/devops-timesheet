package com.timesheet.service;

import com.timesheet.repository.TimesheetRepository;
import org.springframework.stereotype.Service;

/**
 * Service layer for timesheet operations.
 *
 * Week 3 skeleton: the repository is wired in to prove the layered architecture,
 * but no real business logic is implemented yet. Methods return simple placeholder
 * data so the controller has something to call.
 */
@Service
public class TimesheetService {

    private final TimesheetRepository timesheetRepository;

    public TimesheetService(TimesheetRepository timesheetRepository) {
        this.timesheetRepository = timesheetRepository;
    }

    /**
     * Placeholder health message returned by the controller so the frontend
     * can prove end-to-end connectivity.
     */
    public String status() {
        return "Timesheet backend is running (Week 3 skeleton).";
    }
}

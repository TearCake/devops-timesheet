package com.timesheet.service;

import com.timesheet.model.Timesheet;
import com.timesheet.model.TimesheetStatus;
import com.timesheet.repository.TimesheetRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Service layer for timesheet business logic and database operations.
 * Week 5: Full CRUD implementation with role-based status transitions.
 */
@Service
public class TimesheetService {

    private final TimesheetRepository timesheetRepository;

    public TimesheetService(TimesheetRepository timesheetRepository) {
        this.timesheetRepository = timesheetRepository;
    }

    public List<Timesheet> getAllTimesheets() {
        return timesheetRepository.findAll();
    }

    public Optional<Timesheet> getTimesheetById(Long id) {
        return timesheetRepository.findById(id);
    }

    public Timesheet createTimesheet(Timesheet timesheet) {
        if (timesheet.getStatus() == null) {
            timesheet.setStatus(TimesheetStatus.DRAFT);
        }
        if (timesheet.getUserId() == null) {
            timesheet.setUserId(1L); // Default test user (Asha Rao)
        }
        if (timesheet.getProjectId() == null) {
            timesheet.setProjectId(1L); // Default test project
        }
        return timesheetRepository.save(timesheet);
    }

    public Timesheet updateTimesheet(Long id, Timesheet updatedData) {
        return timesheetRepository.findById(id).map(existing -> {
            if (updatedData.getDate() != null) existing.setDate(updatedData.getDate());
            if (updatedData.getHours() != null) existing.setHours(updatedData.getHours());
            if (updatedData.getDescription() != null) existing.setDescription(updatedData.getDescription());
            if (updatedData.getProjectId() != null) existing.setProjectId(updatedData.getProjectId());
            if (updatedData.getStatus() != null) existing.setStatus(updatedData.getStatus());
            return timesheetRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Timesheet not found with id: " + id));
    }

    public Timesheet submitTimesheet(Long id) {
        return updateStatus(id, TimesheetStatus.SUBMITTED);
    }

    public Timesheet approveTimesheet(Long id) {
        return updateStatus(id, TimesheetStatus.APPROVED);
    }

    public Timesheet rejectTimesheet(Long id) {
        return updateStatus(id, TimesheetStatus.REJECTED);
    }

    private Timesheet updateStatus(Long id, TimesheetStatus newStatus) {
        Timesheet timesheet = timesheetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Timesheet not found with id: " + id));
        timesheet.setStatus(newStatus);
        return timesheetRepository.save(timesheet);
    }

    public void deleteTimesheet(Long id) {
        timesheetRepository.deleteById(id);
    }
}

package com.timesheet.controller;

import com.timesheet.model.Timesheet;
import com.timesheet.service.TimesheetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * REST controller for timesheets.
 * Week 5: Connected to real JPA persistence and MySQL database.
 */
@RestController
@RequestMapping("/api/timesheets")
public class TimesheetController {

    private final TimesheetService timesheetService;

    public TimesheetController(TimesheetService timesheetService) {
        this.timesheetService = timesheetService;
    }

    @GetMapping
    public Map<String, Object> getAll() {
        List<Timesheet> timesheets = timesheetService.getAllTimesheets();
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Timesheets retrieved successfully");
        response.put("data", timesheets);
        return response;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Timesheet> getById(@PathVariable Long id) {
        return timesheetService.getTimesheetById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Timesheet> create(@RequestBody Timesheet timesheet) {
        Timesheet created = timesheetService.createTimesheet(timesheet);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Timesheet> update(@PathVariable Long id, @RequestBody Timesheet timesheet) {
        try {
            Timesheet updated = timesheetService.updateTimesheet(id, timesheet);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/submit")
    public ResponseEntity<Timesheet> submit(@PathVariable Long id) {
        try {
            Timesheet updated = timesheetService.submitTimesheet(id);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/approve")
    public ResponseEntity<Timesheet> approve(@PathVariable Long id) {
        try {
            Timesheet updated = timesheetService.approveTimesheet(id);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/reject")
    public ResponseEntity<Timesheet> reject(@PathVariable Long id) {
        try {
            Timesheet updated = timesheetService.rejectTimesheet(id);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        timesheetService.deleteTimesheet(id);
        return ResponseEntity.noContent().build();
    }
}

package com.timesheet.controller;

import com.timesheet.service.TimesheetService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * REST controller for timesheets.
 *
 * Week 3 skeleton: every endpoint returns a simple JSON placeholder so the frontend
 * can prove connectivity. Real CRUD and status-transition logic arrive from Week 5+.
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
        Map<String, Object> response = new HashMap<>();
        response.put("message", timesheetService.status());
        response.put("data", List.of(
                sample(1L, "2026-08-17", 8.0, "APPROVED"),
                sample(2L, "2026-08-18", 6.5, "SUBMITTED"),
                sample(3L, "2026-08-18", 2.0, "DRAFT")
        ));
        return response;
    }

    @GetMapping("/{id}")
    public Map<String, Object> getById(@PathVariable Long id) {
        return sample(id, "2026-08-18", 8.0, "DRAFT");
    }

    @PostMapping
    public Map<String, Object> create(@RequestBody(required = false) Map<String, Object> body) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Placeholder: timesheet created (Week 3 skeleton)");
        response.put("received", body);
        return response;
    }

    @PutMapping("/{id}")
    public Map<String, Object> update(@PathVariable Long id,
                                      @RequestBody(required = false) Map<String, Object> body) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Placeholder: timesheet " + id + " updated (Week 3 skeleton)");
        response.put("received", body);
        return response;
    }

    @GetMapping("/search")
    public Map<String, Object> search(@RequestParam(required = false) String status) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Placeholder search (Week 3 skeleton)");
        response.put("query", Map.of("status", status == null ? "ALL" : status));
        response.put("data", List.of(sample(1L, "2026-08-17", 8.0, "APPROVED")));
        return response;
    }

    @PatchMapping("/{id}/submit")
    public Map<String, Object> submit(@PathVariable Long id) {
        return statusChange(id, "SUBMITTED");
    }

    @PatchMapping("/{id}/approve")
    public Map<String, Object> approve(@PathVariable Long id) {
        return statusChange(id, "APPROVED");
    }

    @PatchMapping("/{id}/reject")
    public Map<String, Object> reject(@PathVariable Long id) {
        return statusChange(id, "REJECTED");
    }

    // --- helpers (placeholder data only) ---

    private Map<String, Object> statusChange(Long id, String status) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Placeholder: timesheet " + id + " -> " + status + " (Week 3 skeleton)");
        response.put("timesheetId", id);
        response.put("status", status);
        return response;
    }

    private Map<String, Object> sample(Long id, String date, Double hours, String status) {
        Map<String, Object> t = new HashMap<>();
        t.put("timesheetId", id);
        t.put("userId", 1);
        t.put("projectId", 1);
        t.put("date", date);
        t.put("hours", hours);
        t.put("description", "Placeholder timesheet entry");
        t.put("status", status);
        return t;
    }
}

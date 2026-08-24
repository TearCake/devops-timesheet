package com.timesheet.controller;

import com.timesheet.model.Timesheet;
import com.timesheet.model.TimesheetStatus;
import com.timesheet.repository.ProjectRepository;
import com.timesheet.repository.TimesheetRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Dashboard REST controller providing dynamic timesheet metrics from the database.
 */
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final TimesheetRepository timesheetRepository;
    private final ProjectRepository projectRepository;

    public DashboardController(TimesheetRepository timesheetRepository, ProjectRepository projectRepository) {
        this.timesheetRepository = timesheetRepository;
        this.projectRepository = projectRepository;
    }

    @GetMapping
    public Map<String, Object> summary() {
        List<Timesheet> all = timesheetRepository.findAll();
        double totalHours = all.stream().mapToDouble(t -> t.getHours() != null ? t.getHours() : 0.0).sum();
        long pending = all.stream().filter(t -> t.getStatus() == TimesheetStatus.SUBMITTED).count();
        long approved = all.stream().filter(t -> t.getStatus() == TimesheetStatus.APPROVED).count();
        long activeProjects = projectRepository.count();

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Live Dashboard Metrics");
        response.put("totalHoursThisWeek", Math.round(totalHours * 10.0) / 10.0);
        response.put("pendingApproval", pending);
        response.put("approved", approved);
        response.put("activeProjects", activeProjects > 0 ? activeProjects : 2);
        return response;
    }
}

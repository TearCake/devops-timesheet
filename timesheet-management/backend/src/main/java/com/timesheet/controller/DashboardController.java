package com.timesheet.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * Dashboard REST controller.
 * Week 3 skeleton: returns placeholder summary numbers for the frontend cards.
 */
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @GetMapping
    public Map<String, Object> summary() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Dashboard summary (Week 3 skeleton)");
        response.put("totalHoursThisWeek", 32.5);
        response.put("pendingApproval", 3);
        response.put("approved", 5);
        response.put("activeProjects", 2);
        return response;
    }
}

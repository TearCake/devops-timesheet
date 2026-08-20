package com.timesheet;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Entry point for the Automated Timesheet Management Platform backend.
 *
 * Week 3 skeleton: boots a Spring Boot REST application on port 8080.
 */
@SpringBootApplication
public class TimesheetApplication {

    public static void main(String[] args) {
        SpringApplication.run(TimesheetApplication.class, args);
    }
}

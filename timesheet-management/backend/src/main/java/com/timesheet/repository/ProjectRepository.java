package com.timesheet.repository;

import com.timesheet.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Placeholder repository for Project. Week 3: basic CRUD only.
 */
@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
}

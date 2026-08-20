package com.timesheet.repository;

import com.timesheet.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Placeholder repository for User. Week 3: inherits basic CRUD from JpaRepository,
 * no custom queries yet.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
}

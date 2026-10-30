package com.timesheet.repository;

import com.timesheet.model.SignUpRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for SignUpRequest entities.
 */
@Repository
public interface SignUpRequestRepository extends JpaRepository<SignUpRequest, Long> {
    List<SignUpRequest> findByStatus(String status);
    List<SignUpRequest> findAllByOrderByRequestIdDesc();
    Optional<SignUpRequest> findByEmail(String email);
    boolean existsByEmail(String email);
}

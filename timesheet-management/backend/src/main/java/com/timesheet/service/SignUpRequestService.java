package com.timesheet.service;

import com.timesheet.model.SignUpRequest;
import com.timesheet.model.User;
import com.timesheet.repository.SignUpRequestRepository;
import com.timesheet.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class SignUpRequestService {

    private final SignUpRequestRepository signUpRequestRepository;
    private final UserRepository userRepository;

    public SignUpRequestService(SignUpRequestRepository signUpRequestRepository, UserRepository userRepository) {
        this.signUpRequestRepository = signUpRequestRepository;
        this.userRepository = userRepository;
    }

    public SignUpRequest createRequest(SignUpRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email is required.");
        }
        if (request.getName() == null || request.getName().isBlank()) {
            throw new IllegalArgumentException("Name is required.");
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new IllegalArgumentException("Password is required.");
        }

        String email = request.getEmail().trim().toLowerCase();
        request.setEmail(email);

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("An active account with this email already exists.");
        }

        Optional<SignUpRequest> existingOpt = signUpRequestRepository.findByEmail(email);
        if (existingOpt.isPresent()) {
            SignUpRequest existing = existingOpt.get();
            if ("PENDING".equalsIgnoreCase(existing.getStatus())) {
                throw new IllegalArgumentException("A pending sign-up request for this email already exists.");
            }
            // If previously rejected, allow re-applying with updated details
            existing.setName(request.getName());
            existing.setPassword(request.getPassword());
            existing.setRole(request.getRole() != null ? request.getRole() : "EMPLOYEE");
            existing.setStatus("PENDING");
            existing.setCreatedAt(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
            return signUpRequestRepository.save(existing);
        }

        if (request.getRole() == null || request.getRole().isBlank()) {
            request.setRole("EMPLOYEE");
        }

        // When someone signs up as a Manager, auto-approve and create User directly
        if ("MANAGER".equalsIgnoreCase(request.getRole())) {
            request.setStatus("APPROVED");
            request.setCreatedAt(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
            SignUpRequest savedRequest = signUpRequestRepository.save(request);
            User user = new User(request.getName(), email, request.getPassword(), "MANAGER");
            userRepository.save(user);
            return savedRequest;
        }

        // When someone signs up as an Employee, it creates a request in PENDING state
        request.setStatus("PENDING");
        request.setCreatedAt(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
        return signUpRequestRepository.save(request);
    }

    public List<SignUpRequest> getAllRequests(String status) {
        if (status != null && !status.isBlank() && !"ALL".equalsIgnoreCase(status)) {
            return signUpRequestRepository.findByStatus(status.toUpperCase());
        }
        return signUpRequestRepository.findAllByOrderByRequestIdDesc();
    }

    public Optional<SignUpRequest> getRequestById(Long id) {
        return signUpRequestRepository.findById(id);
    }

    public SignUpRequest approveRequest(Long id) {
        SignUpRequest request = signUpRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sign-up request not found with ID: " + id));

        request.setStatus("APPROVED");
        SignUpRequest saved = signUpRequestRepository.save(request);

        // Provision/activate the approved User account
        Optional<User> existingUserOpt = userRepository.findByEmail(request.getEmail());
        if (existingUserOpt.isPresent()) {
            User existing = existingUserOpt.get();
            existing.setName(request.getName());
            existing.setPassword(request.getPassword());
            existing.setRole(request.getRole());
            existing.setStatus("APPROVED");
            userRepository.save(existing);
        } else {
            User newUser = new User(request.getName(), request.getEmail(), request.getPassword(), request.getRole());
            newUser.setStatus("APPROVED");
            userRepository.save(newUser);
        }

        return saved;
    }

    public SignUpRequest rejectRequest(Long id) {
        SignUpRequest request = signUpRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sign-up request not found with ID: " + id));

        request.setStatus("REJECTED");
        return signUpRequestRepository.save(request);
    }
}

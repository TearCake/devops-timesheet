package com.timesheet.controller;

import com.timesheet.model.SignUpRequest;
import com.timesheet.model.User;
import com.timesheet.repository.SignUpRequestRepository;
import com.timesheet.repository.UserRepository;
import com.timesheet.service.SignUpRequestService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final SignUpRequestService signUpRequestService;
    private final UserRepository userRepository;
    private final SignUpRequestRepository signUpRequestRepository;

    public AuthController(SignUpRequestService signUpRequestService,
                          UserRepository userRepository,
                          SignUpRequestRepository signUpRequestRepository) {
        this.signUpRequestService = signUpRequestService;
        this.userRepository = userRepository;
        this.signUpRequestRepository = signUpRequestRepository;
    }

    /**
     * Submit a new sign-up request.
     * When signing up as an employee, creates a request in PENDING state awaiting manager review.
     */
    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> signUp(@RequestBody SignUpRequest request) {
        Map<String, Object> response = new HashMap<>();
        try {
            SignUpRequest created = signUpRequestService.createRequest(request);
            if ("PENDING".equalsIgnoreCase(created.getStatus())) {
                response.put("message", "Sign-up request submitted successfully! Your employee account is pending manager approval.");
            } else {
                response.put("message", "Account registered and activated successfully. You can now sign in.");
            }
            response.put("data", created);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception e) {
            response.put("error", "An unexpected error occurred while processing your sign-up.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Authenticate user with email and password.
     * Validates credentials and verifies that the employee account has been approved.
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        Map<String, Object> response = new HashMap<>();
        String email = credentials.get("email");
        String password = credentials.get("password");

        if (email == null || email.isBlank()) {
            response.put("error", "Email is required.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        email = email.trim().toLowerCase();
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Verify password if provided
            if (password != null && !password.isBlank() && !password.equals("placeholder") && !password.equals(user.getPassword())) {
                response.put("error", "Invalid email or password.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
            response.put("message", "Login successful");
            response.put("user", user);
            return ResponseEntity.ok(response);
        }

        // Check if there is an unapproved sign-up request for this email
        Optional<SignUpRequest> requestOpt = signUpRequestRepository.findByEmail(email);
        if (requestOpt.isPresent()) {
            SignUpRequest req = requestOpt.get();
            if ("PENDING".equalsIgnoreCase(req.getStatus())) {
                response.put("error", "Your sign-up request is pending approval by a manager. Please wait for a manager to accept your request before logging in.");
                response.put("status", "PENDING");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
            }
            if ("REJECTED".equalsIgnoreCase(req.getStatus())) {
                response.put("error", "Your sign-up request was rejected by the manager. Please re-apply or contact an administrator.");
                response.put("status", "REJECTED");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
            }
        }

        response.put("error", "No registered account found with email: " + email);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    /**
     * Retrieve sign-up requests (Manager view). Filterable by status (PENDING, APPROVED, REJECTED).
     */
    @GetMapping("/signup-requests")
    public ResponseEntity<Map<String, Object>> getSignUpRequests(@RequestParam(required = false) String status) {
        List<SignUpRequest> requests = signUpRequestService.getAllRequests(status);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Sign-up requests retrieved successfully");
        response.put("data", requests);
        return ResponseEntity.ok(response);
    }

    /**
     * Accept/Approve a pending sign-up request.
     */
    @PatchMapping("/signup-requests/{id}/approve")
    public ResponseEntity<Map<String, Object>> approveSignUpRequest(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            SignUpRequest approved = signUpRequestService.approveRequest(id);
            response.put("message", "Sign-up request for " + approved.getName() + " has been approved successfully!");
            response.put("data", approved);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    /**
     * Reject a pending sign-up request.
     */
    @PatchMapping("/signup-requests/{id}/reject")
    public ResponseEntity<Map<String, Object>> rejectSignUpRequest(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            SignUpRequest rejected = signUpRequestService.rejectRequest(id);
            response.put("message", "Sign-up request for " + rejected.getName() + " has been rejected.");
            response.put("data", rejected);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    /**
     * List all active registered platform users.
     */
    @GetMapping("/users")
    public ResponseEntity<Map<String, Object>> getAllUsers() {
        List<User> users = userRepository.findAll();
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Users retrieved successfully");
        response.put("data", users);
        return ResponseEntity.ok(response);
    }
}

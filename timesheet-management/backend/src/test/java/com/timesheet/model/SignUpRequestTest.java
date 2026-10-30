package com.timesheet.model;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("SignUpRequest Model & Lifecycle Unit Tests")
class SignUpRequestTest {

    @Test
    @DisplayName("Should create sign-up request with valid fields and default PENDING status")
    void testSignUpRequestCreation() {
        SignUpRequest request = new SignUpRequest("Rahul Sharma", "rahul@example.com", "secret123", "EMPLOYEE");
        request.setRequestId(10L);

        assertEquals(10L, request.getRequestId());
        assertEquals("Rahul Sharma", request.getName());
        assertEquals("rahul@example.com", request.getEmail());
        assertEquals("secret123", request.getPassword());
        assertEquals("EMPLOYEE", request.getRole());
        assertEquals("PENDING", request.getStatus());
    }

    @Test
    @DisplayName("Should support status transitions (PENDING -> APPROVED / REJECTED)")
    void testStatusTransitions() {
        SignUpRequest request = new SignUpRequest("Ananya Verma", "ananya@example.com", "pass123", "EMPLOYEE");
        assertEquals("PENDING", request.getStatus());

        // Manager approves request
        request.setStatus("APPROVED");
        assertEquals("APPROVED", request.getStatus());

        // Or manager rejects request
        request.setStatus("REJECTED");
        assertEquals("REJECTED", request.getStatus());
    }

    @Test
    @DisplayName("Should handle pre-persist lifecycle hook")
    void testPrePersist() {
        SignUpRequest request = new SignUpRequest();
        request.setName("Karan Roy");
        request.setEmail("karan@example.com");
        request.setPassword("karanPass");
        request.onPrePersist();

        assertEquals("PENDING", request.getStatus());
        assertNotNull(request.getCreatedAt());
        assertFalse(request.getCreatedAt().isBlank());
    }
}

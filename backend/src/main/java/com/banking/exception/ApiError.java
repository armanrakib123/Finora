package com.banking.exception;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Unified error response structure for the entire API.
 * Every exception is translated to this shape before reaching the frontend.
 *
 * Example JSON output:
 * {
 * "timestamp": "2026-07-01T08:00:00",
 * "status": 404,
 * "error": "Not Found",
 * "message": "Account not found with number: ACC-2026-000001",
 * "path": "/api/accounts/ACC-2026-000001",
 * "details": []
 * }
 */
@Data
@Builder
@AllArgsConstructor
public class ApiError {

    private LocalDateTime timestamp;
    private int status;
    private String error;
    private String message;
    private String path;
    private List<String> details;

}
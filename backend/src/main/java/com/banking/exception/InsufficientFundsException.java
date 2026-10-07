package com.banking.exception;

/**
 * Thrown when a withdrawal or transfer exceeds the available account balance.
 * Maps to HTTP 400 Bad Request (business rule violation).
 */
public class InsufficientFundsException extends RuntimeException {

    public InsufficientFundsException(String message) {
        super(message);
    }
}
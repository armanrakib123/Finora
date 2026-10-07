package com.banking.entity;

/**
 * The type of a bank account.
 * <p>
 * {@code SAVINGS} — Interest-bearing account for personal savings.
 * Typically has transaction limits.
 * <p>
 * {@code CURRENT} — Day-to-day spending account (checking account).
 * Unlimited transactions, usually no interest.
 */
public enum AccountType {
    SAVINGS,
    CURRENT
}
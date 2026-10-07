package com.banking.entity;

/**
 * Roles for role-based access control (RBAC).
 * <p>
 * {@code USER} — Regular bank customer (default).
 * Can view own accounts, perform transactions, view own history.
 * <p>
 * {@code ADMIN} — Bank administrator.
 * Can manage users, view all accounts, view all transactions.
 */
public enum Role {
    USER,
    ADMIN
}
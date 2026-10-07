package com.banking.repository;

import com.banking.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Data access layer for {@link User} entities.
 * <p>
 * Spring Data JPA automatically implements all methods declared here.
 * No need to write {@code EntityManager} or {@code Session} code.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Find a user by their email address (used during login).
     * Email is unique in the database, so this returns at most one result.
     */
    Optional<User> findByEmail(String email);

    /**
     * Check if an email is already registered (used during registration).
     */
    boolean existsByEmail(String email);
}
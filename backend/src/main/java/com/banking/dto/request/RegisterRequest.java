package com.banking.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    @NotBlank(message = "Password is required")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{6,40}$", message = "Password must be 6-40 characters with uppercase, lowercase and a digit")
    private String password;

    @Pattern(regexp = "^$|^\\+?[0-9]{7,15}$", message = "Phone number must be a valid international format (7-15 digits)")
    private String phone;
}

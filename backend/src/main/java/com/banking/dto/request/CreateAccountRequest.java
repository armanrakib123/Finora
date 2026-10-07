package com.banking.dto.request;

import com.banking.entity.AccountType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateAccountRequest {
    @NotNull(message = "Account type is required (SAVINGS or CURRENT)")
    private AccountType type;
}

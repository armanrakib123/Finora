package com.banking.service;

import com.banking.dto.response.AccountResponse;
import com.banking.dto.response.TransactionResponse;
import com.banking.entity.User;
import java.util.List;

public interface AdminService {
    List<User> getAllUsers();
    User toggleUserEnabled(Long userId);
    List<AccountResponse> getAllAccounts();
    List<TransactionResponse> getAllTransactions();
}

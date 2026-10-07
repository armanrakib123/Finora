package com.banking.service;

import com.banking.dto.request.CreateAccountRequest;
import com.banking.dto.response.AccountResponse;
import java.util.List;

public interface AccountService {
    AccountResponse createAccount(CreateAccountRequest request);
    AccountResponse getAccountByNumber(String accountNumber);
    List<AccountResponse> getMyAccounts();
    void closeAccount(String accountNumber);
}

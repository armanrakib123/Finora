package com.banking.service.impl;

import com.banking.dto.request.CreateAccountRequest;
import com.banking.dto.response.AccountResponse;
import com.banking.entity.Account;
import com.banking.entity.AccountStatus;
import com.banking.entity.User;
import com.banking.exception.BadRequestException;
import com.banking.exception.ResourceNotFoundException;
import com.banking.mapper.AccountMapper;
import com.banking.repository.AccountRepository;
import com.banking.service.AccountService;
import com.banking.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {

    private static final Logger log = LoggerFactory.getLogger(AccountServiceImpl.class);

    private final AccountRepository accountRepository;
    private final AuthService authService;
    private final AccountMapper accountMapper;

    @Override
    @Transactional
    public AccountResponse createAccount(CreateAccountRequest request) {
        User currentUser = authService.getCurrentUser();
        log.info("Creating {} account for user: {}", request.getType(), currentUser.getEmail());

        String accountNumber = generateAccountNumber();

        Account account = Account.builder()
                .user(currentUser)
                .accountNumber(accountNumber)
                .type(request.getType())
                .balance(BigDecimal.ZERO)
                .status(AccountStatus.ACTIVE)
                .build();

        account = accountRepository.save(account);
        log.info("Account created: {} for user: {}", accountNumber, currentUser.getEmail());

        return accountMapper.toResponse(account);
    }

    @Override
    @Transactional(readOnly = true)
    public AccountResponse getAccountByNumber(String accountNumber) {
        User currentUser = authService.getCurrentUser();
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Account not found with number: " + accountNumber));

        // Users can only view their own accounts
        if (!account.getUser().getId().equals(currentUser.getId()) &&
                !currentUser.getRole().name().equals("ADMIN")) {
            throw new BadRequestException("You do not have access to this account");
        }

        return accountMapper.toResponse(account);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AccountResponse> getMyAccounts() {
        User currentUser = authService.getCurrentUser();
        return accountRepository.findByUserOrderByCreatedAtDesc(currentUser)
                .stream()
                .map(accountMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void closeAccount(String accountNumber) {
        User currentUser = authService.getCurrentUser();
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Account not found with number: " + accountNumber));

        if (!account.getUser().getId().equals(currentUser.getId())) {
            throw new BadRequestException("You do not have access to this account");
        }

        if (account.getStatus() == AccountStatus.CLOSED) {
            throw new BadRequestException("Account is already closed");
        }

        if (account.getBalance().compareTo(BigDecimal.ZERO) > 0) {
            throw new BadRequestException(
                    "Cannot close account with positive balance. Balance: " + account.getBalance());
        }

        account.setStatus(AccountStatus.CLOSED);
        accountRepository.save(account);
        log.info("Account closed: {}", accountNumber);
    }

    /**
     * Generate a unique account number in the format ACC-YYYY-NNNNNN.
     */
    private String generateAccountNumber() {
        String year = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy"));
        String random = String.format("%06d", new Random().nextInt(999999));
        String number = "ACC-" + year + "-" + random;

        while (accountRepository.existsByAccountNumber(number)) {
            random = String.format("%06d", new Random().nextInt(999999));
            number = "ACC-" + year + "-" + random;
        }
        return number;
    }
}

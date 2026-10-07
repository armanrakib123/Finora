package com.banking.service.impl;

import com.banking.dto.request.DepositRequest;
import com.banking.dto.request.TransferRequest;
import com.banking.dto.request.WithdrawRequest;
import com.banking.dto.response.TransactionResponse;
import com.banking.entity.*;
import com.banking.exception.BadRequestException;
import com.banking.exception.InsufficientFundsException;
import com.banking.exception.ResourceNotFoundException;
import com.banking.mapper.TransactionMapper;
import com.banking.repository.AccountRepository;
import com.banking.repository.TransactionRepository;
import com.banking.service.AuthService;
import com.banking.service.TransactionService;
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
public class TransactionServiceImpl implements TransactionService {

    private static final Logger log = LoggerFactory.getLogger(TransactionServiceImpl.class);

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;
    private final AuthService authService;
    private final TransactionMapper transactionMapper;

    @Override
    @Transactional
    public TransactionResponse deposit(DepositRequest request) {
        User currentUser = authService.getCurrentUser();
        log.info("Deposit request: {} into account {}", request.getAmount(), request.getAccountNumber());

        Account account = accountRepository.findByAccountNumber(request.getAccountNumber())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Account not found: " + request.getAccountNumber()));

        if (!account.getUser().getId().equals(currentUser.getId()) && !isAdmin(currentUser)) {
            throw new BadRequestException("You do not own this account");
        }
        if (account.getStatus() != AccountStatus.ACTIVE) {
            throw new BadRequestException("Account is not active");
        }

        account.setBalance(account.getBalance().add(request.getAmount()));
        accountRepository.save(account);

        Transaction txn = Transaction.builder()
                .toAccountId(account.getId())
                .amount(request.getAmount())
                .type(TransactionType.DEPOSIT)
                .description(request.getDescription() != null ? request.getDescription() : "Deposit")
                .referenceNumber(generateReferenceNumber())
                .build();
        txn = transactionRepository.save(txn);

        log.info("Deposit successful. Ref: {}", txn.getReferenceNumber());
        return transactionMapper.toResponse(txn);
    }

    @Override
    @Transactional
    public TransactionResponse withdraw(WithdrawRequest request) {
        User currentUser = authService.getCurrentUser();
        log.info("Withdraw request: {} from account {}", request.getAmount(), request.getAccountNumber());

        Account account = accountRepository.findByAccountNumber(request.getAccountNumber())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Account not found: " + request.getAccountNumber()));

        if (!account.getUser().getId().equals(currentUser.getId())) {
            throw new BadRequestException("You do not own this account");
        }
        if (account.getStatus() != AccountStatus.ACTIVE) {
            throw new BadRequestException("Account is not active");
        }
        if (account.getBalance().compareTo(request.getAmount()) < 0) {
            throw new InsufficientFundsException(
                    "Insufficient funds. Available: " + account.getBalance() + ", Requested: " + request.getAmount());
        }

        account.setBalance(account.getBalance().subtract(request.getAmount()));
        accountRepository.save(account);

        Transaction txn = Transaction.builder()
                .fromAccountId(account.getId())
                .amount(request.getAmount())
                .type(TransactionType.WITHDRAWAL)
                .description(request.getDescription() != null ? request.getDescription() : "Withdrawal")
                .referenceNumber(generateReferenceNumber())
                .build();
        txn = transactionRepository.save(txn);

        log.info("Withdrawal successful. Ref: {}", txn.getReferenceNumber());
        return transactionMapper.toResponse(txn);
    }

    @Override
    @Transactional
    public TransactionResponse transfer(TransferRequest request) {
        User currentUser = authService.getCurrentUser();
        log.info("Transfer request: {} from {} to {}", request.getAmount(),
                request.getFromAccountNumber(), request.getToAccountNumber());

        if (request.getFromAccountNumber().equals(request.getToAccountNumber())) {
            throw new BadRequestException("Cannot transfer to the same account");
        }

        Account fromAccount = accountRepository.findByAccountNumber(request.getFromAccountNumber())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Source account not found: " + request.getFromAccountNumber()));
        Account toAccount = accountRepository.findByAccountNumber(request.getToAccountNumber())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Destination account not found: " + request.getToAccountNumber()));

        if (!fromAccount.getUser().getId().equals(currentUser.getId())) {
            throw new BadRequestException("You do not own the source account");
        }
        if (fromAccount.getStatus() != AccountStatus.ACTIVE) {
            throw new BadRequestException("Source account is not active");
        }
        if (toAccount.getStatus() != AccountStatus.ACTIVE) {
            throw new BadRequestException("Destination account is not active");
        }
        if (fromAccount.getBalance().compareTo(request.getAmount()) < 0) {
            throw new InsufficientFundsException(
                    "Insufficient funds. Available: " + fromAccount.getBalance());
        }

        fromAccount.setBalance(fromAccount.getBalance().subtract(request.getAmount()));
        toAccount.setBalance(toAccount.getBalance().add(request.getAmount()));
        accountRepository.save(fromAccount);
        accountRepository.save(toAccount);

        Transaction txn = Transaction.builder()
                .fromAccountId(fromAccount.getId())
                .toAccountId(toAccount.getId())
                .amount(request.getAmount())
                .type(TransactionType.TRANSFER)
                .description(request.getDescription() != null ? request.getDescription() : "Transfer")
                .referenceNumber(generateReferenceNumber())
                .build();
        txn = transactionRepository.save(txn);

        log.info("Transfer successful. Ref: {}", txn.getReferenceNumber());
        return transactionMapper.toResponse(txn);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TransactionResponse> getTransactionHistory(String accountNumber) {
        User currentUser = authService.getCurrentUser();
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Account not found: " + accountNumber));

        if (!account.getUser().getId().equals(currentUser.getId()) && !isAdmin(currentUser)) {
            throw new BadRequestException("You do not own this account");
        }

        List<Transaction> txns = transactionRepository
                .findByFromAccountIdOrToAccountIdOrderByCreatedAtDesc(account.getId(), account.getId());

        return txns.stream().map(transactionMapper::toResponse).collect(Collectors.toList());
    }

    private String generateReferenceNumber() {
        String ts = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String rand = String.format("%04d", new Random().nextInt(9999));
        return "TXN-" + ts + "-" + rand;
    }

    private boolean isAdmin(User user) {
        return user.getRole() == Role.ADMIN;
    }
}

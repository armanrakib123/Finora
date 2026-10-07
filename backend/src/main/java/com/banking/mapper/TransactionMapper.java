package com.banking.mapper;

import com.banking.dto.response.TransactionResponse;
import com.banking.entity.Transaction;
import org.springframework.stereotype.Component;

@Component
public class TransactionMapper {

    public TransactionResponse toResponse(Transaction txn) {
        return TransactionResponse.builder()
                .id(txn.getId())
                .fromAccountNumber(txn.getFromAccountId() != null ? txn.getFromAccountId().toString() : null)
                .toAccountNumber(txn.getToAccountId() != null ? txn.getToAccountId().toString() : null)
                .amount(txn.getAmount())
                .type(txn.getType())
                .description(txn.getDescription())
                .referenceNumber(txn.getReferenceNumber())
                .createdAt(txn.getCreatedAt())
                .build();
    }
}

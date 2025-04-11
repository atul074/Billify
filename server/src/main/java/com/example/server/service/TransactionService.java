package com.example.server.service;

import com.example.server.dto.Response;
import com.example.server.dto.TransactionRequest;

public interface TransactionService {
    Response purchase(TransactionRequest transactionRequest);

    Response sell(TransactionRequest transactionRequest);

    Response getAllTransactions();

    Response getAllTransactionById(Long id);
}

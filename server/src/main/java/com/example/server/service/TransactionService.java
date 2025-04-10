package com.example.server.service;

import com.example.server.dto.Response;
import com.example.server.dto.TransactionRequest;

public interface TransactionService {
    Response purchase(TransactionRequest transactionRequest);
}

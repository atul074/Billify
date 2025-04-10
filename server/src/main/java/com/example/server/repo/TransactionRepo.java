package com.example.server.repo;

import com.example.server.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface TransactionRepo extends JpaRepository<Transaction, Long>, JpaSpecificationExecutor<Transaction> {
}

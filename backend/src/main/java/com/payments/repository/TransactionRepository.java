package com.payments.repository;

import com.payments.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUserId(Long userId);
    List<Transaction> findByCardHash(String cardHash);
    @Transactional
    void deleteByUserId(Long userId);
    boolean existsByUserId(Long userId);
}

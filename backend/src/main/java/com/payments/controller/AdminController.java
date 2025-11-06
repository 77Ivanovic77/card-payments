package com.payments.controller;

import com.payments.model.Transaction;
import com.payments.model.User;
import com.payments.repository.TransactionRepository;
import com.payments.repository.UserRepository;
import com.payments.util.HashUtil;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final UserRepository userRepository;
    private final TransactionRepository txRepo;
    private final HashUtil hashUtil;

    public AdminController(UserRepository userRepository, TransactionRepository txRepo, HashUtil hashUtil) {
        this.userRepository = userRepository;
        this.txRepo = txRepo;
        this.hashUtil = hashUtil;
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/transactions")
    public List<Transaction> getAllTransactions() {
        return txRepo.findAll();
    }

    @GetMapping("/transactions/by-pan")
    public List<Transaction> findByPan(@RequestParam("pan") String pan) {
        String normalized = pan.replaceAll("\s+", "");
        String h = hashUtil.hmacSha256Base64(normalized);
        return txRepo.findByCardHash(h);
    }
}

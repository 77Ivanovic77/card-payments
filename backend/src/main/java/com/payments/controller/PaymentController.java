package com.payments.controller;

import com.payments.model.Transaction;
import com.payments.model.User;
import com.payments.repository.TransactionRepository;
import com.payments.repository.UserRepository;
import com.payments.util.AesEncryptionService;
import com.payments.util.HashUtil;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {
    private final TransactionRepository txRepo;
    private final UserRepository userRepo;
    private final AesEncryptionService aes;
    private final HashUtil hashUtil;

    public PaymentController(TransactionRepository txRepo, UserRepository userRepo, AesEncryptionService aes, HashUtil hashUtil) {
        this.txRepo = txRepo;
        this.userRepo = userRepo;
        this.aes = aes;
        this.hashUtil = hashUtil;
    }

    record PaymentRequest(String cardNumber, String cardHolder, String cardExpiry, BigDecimal amount, String currency) {}

    @PostMapping
    public ResponseEntity<?> createPayment(@RequestBody @Valid PaymentRequest req, Authentication auth) throws Exception {
        if (req.cardNumber() == null || req.amount() == null) return ResponseEntity.badRequest().body(Map.of("message","invalid"));
        if (!luhnCheck(req.cardNumber())) return ResponseEntity.badRequest().body(Map.of("message","invalid card number"));

        String username = (String) auth.getPrincipal();
        User u = userRepo.findByUsername(username).orElseThrow();

        String pan = req.cardNumber().replaceAll("\\s+","");

        String panHash = hashUtil.hmacSha256Base64(pan);
        String last4 = pan.length() >= 4 ? pan.substring(pan.length() - 4) : pan;
        String panEncrypted = aes.encrypt(pan);

        Transaction tx = new Transaction();
        tx.setAmount(req.amount());
        tx.setCurrency(req.currency() == null ? "MXN" : req.currency());
        tx.setCreatedAt(Instant.now());
        tx.setCardNumberEncrypted(panEncrypted);
        tx.setCardHolderEncrypted(aes.encrypt(req.cardHolder() == null ? "" : req.cardHolder()));
        tx.setCardExpiryEncrypted(aes.encrypt(req.cardExpiry() == null ? "" : req.cardExpiry()));
        tx.setCardHash(panHash);
        tx.setCardLast4(last4);
        tx.setUser(u);
        String status = pan.endsWith("0") ? "DECLINED" : "APPROVED";
        tx.setStatus(status);

        txRepo.save(tx);

        return ResponseEntity.ok(Map.of("transactionId", tx.getId(), "status", status, "last4", last4));
    }

    @GetMapping
    public ResponseEntity<?> listTransactions(Authentication auth) {
        String username = (String) auth.getPrincipal();
        var user = userRepo.findByUsername(username).orElseThrow();
        boolean isAdmin = user.getRoles().stream().anyMatch(r -> r.name().equals("ROLE_ADMIN"));
        List<Transaction> list = isAdmin ? txRepo.findAll() : txRepo.findByUserId(user.getId());

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("HH:mm dd/MM/yy").withZone(ZoneId.of("America/Mexico_City"));

        return ResponseEntity.ok(list.stream().map(tx -> Map.of(
                "id", tx.getId(),
                "user", tx.getUser().getUsername(),
                "amount", tx.getAmount(),
                "currency", tx.getCurrency(),
                "status", tx.getStatus(),
                "createdAt", tx.getCreatedAt(),
                "last4", tx.getCardLast4()
        )));
    }

    @DeleteMapping("/{id}")
        public ResponseEntity<?> deletePayment(@PathVariable Long id, Authentication auth) {
            String username = (String) auth.getPrincipal();
            var user = userRepo.findByUsername(username).orElseThrow();

            boolean isAdmin = user.getRoles().stream().anyMatch(r -> r.name().equals("ROLE_ADMIN"));
            if (!isAdmin) {
                return ResponseEntity.status(403).body(Map.of("message", "Access denied"));
            }

            var tx = txRepo.findById(id);
            if (tx.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of("message", "Transaction not found"));
            }

            txRepo.delete(tx.get());
            return ResponseEntity.ok(Map.of("message", "Transaction deleted"));
        }

    private boolean luhnCheck(String cc) {
        int sum = 0; boolean alt = false;
        for (int i = cc.length() - 1; i >= 0; i--) {
            int n = Integer.parseInt(cc.substring(i, i + 1));
            if (alt) {
                n *= 2;
                if (n > 9) n -= 9;
            }
            sum += n;
            alt = !alt;
        }
        return sum % 10 == 0;
    }
}

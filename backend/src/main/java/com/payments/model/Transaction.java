package com.payments.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private BigDecimal amount;
    private String currency;
    private Instant createdAt;

    @Column(name = "card_number_enc")
    private String cardNumberEncrypted;

    @Column(name = "card_holder_enc")
    private String cardHolderEncrypted;

    @Column(name = "card_expiry_enc")
    private String cardExpiryEncrypted;

    @Column(name = "card_hash", length = 128)
    private String cardHash;

    @Column(name = "card_last4", length = 4)
    private String cardLast4;

    private String status; // PENDING, APPROVED, DECLINED

    @ManyToOne
    private User user;
}

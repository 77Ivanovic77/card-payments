package com.payments.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
import java.nio.charset.StandardCharsets;

@Component
public class HashUtil {

    private final SecretKeySpec keySpec;

    public HashUtil(@Value("${encryption.hmac-key}") String hmacKeyBase64) {
        if (hmacKeyBase64 == null || hmacKeyBase64.isBlank()) {
            throw new IllegalArgumentException("hmac.key is required");
        }
        byte[] key = Base64.getDecoder().decode(hmacKeyBase64);
        this.keySpec = new SecretKeySpec(key, "HmacSHA256");
    }

    public String hmacSha256Base64(String data) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(keySpec);
            byte[] raw = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(raw);
        } catch (Exception ex) {
            throw new RuntimeException("Error computing HMAC", ex);
        }
    }
}

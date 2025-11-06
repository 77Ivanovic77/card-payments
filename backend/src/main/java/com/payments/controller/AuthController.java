package com.payments.controller;

import com.payments.model.Role;
import com.payments.model.User;
import com.payments.repository.UserRepository;
//import com.payments.service.AuthService;
import com.payments.security.JwtService;
//import com.payments.util.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

//import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

//auth
import org.springframework.security.core.Authentication;

import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    JwtService jwtService = new JwtService();
    record RegisterRequest(String username, String password, String email, String role) {}
    record AuthRequest(String username, String password) {}
    //public record AuthRequest(@NotBlank String username,@NotBlank String password) {}

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid RegisterRequest req) {
        if (userRepository.findByUsername(req.username()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message","username exists"));
        }
        User u = new User();
        u.setUsername(req.username());
        u.setPasswordHash(passwordEncoder.encode(req.password()));
        u.setEmail(req.email());
        if ("ADMIN".equalsIgnoreCase(req.role())) {
            u.setRoles(Set.of(Role.ROLE_ADMIN));
        } else {
            u.setRoles(Set.of(Role.ROLE_USER));
        }
        userRepository.save(u);
        return ResponseEntity.ok(Map.of("message","registered"));
    }

    @PostMapping("/login")
        public ResponseEntity<?> login(@RequestBody @Valid AuthRequest req, HttpServletResponse response) {
        
            //var userOpt = userRepository.findByUsername(req.username());
            var userOpt = userRepository.findByUsername(req.username());
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(401).body(Map.of("message", "invalid"));
            }
        
        
            var user = userOpt.get();
            if (!passwordEncoder.matches(req.password(), user.getPasswordHash())) {
                return ResponseEntity.status(401).body(Map.of("message", "invalid"));
            }

            // Obtiene roles para incluirlos en el JWT
            //var roles = user.getRoles().stream().map(Enum::name).toList();
            var roles = user.getRoles().stream().map(Enum::name).toList();

            //  Genera token correctamente usando username y roles
            //String token = jwtService.generateToken(user.getUsername(), roles);
            String token = jwtService.generateToken(user.getUsername(), roles);
            Cookie cookie = new Cookie("token", token);
            cookie.setHttpOnly(true);
            cookie.setSecure(true); // porque usas HTTPS
            cookie.setPath("/");
            cookie.setMaxAge(60 * 60);
            cookie.setAttribute("SameSite", "None");
            response.addCookie(cookie);
            //return ResponseEntity.ok(Map.of("message", "ok"));
            return ResponseEntity.ok(Map.of("message","login successful", "role", roles));
            //return ResponseEntity.ok(Map.of("username", user.getUsername(),"roles", roles));
            
        }


    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("token", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        cookie.setAttribute("SameSite", "None");
        response.addCookie(cookie);
        return ResponseEntity.ok(Map.of("message","logged out"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication auth) {

        if (auth == null) {
            return ResponseEntity.ok(Map.of(
                    "username", "",
                    "role", ""
            ));
        }

        String username = auth.getName(); // ← Puede ser null si el token fue mal procesado
        if (username == null) username = "";

        String role = auth.getAuthorities().stream()
                .findFirst()
                .map(a -> a.getAuthority().replace("ROLE_", ""))
                .orElse("");
        
        return ResponseEntity.ok(Map.of(
                "username", username,
                "role", role
        ));
    }
}

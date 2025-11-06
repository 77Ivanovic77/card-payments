package com.payments.controller;

import com.payments.model.User;
import com.payments.controller.AuthController.RegisterRequest;
import com.payments.model.Role;
import com.payments.repository.UserRepository;


import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import com.payments.repository.TransactionRepository;

//import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/users")
//@CrossOrigin(origins = "https://localhost:5173", allowCredentials = "true")
public class UserController {
    
    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserRepository userRepo, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }

    // LISTAR USUARIOS (solo admin)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> listUsers() {
        var list = userRepo.findAll().stream().map(u -> Map.of(
                "id", u.getId(),
                "username", u.getUsername(),
                "roles", u.getRoles().stream().map(Enum::name).toList()
        ));
        return ResponseEntity.ok(list);
    }

    // CREAR USUARIO (solo admin)
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid RegisterRequest req) {

        if (userRepo.findByUsername(req.username()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message","username exists"));
        }

        User u = new User();
        u.setUsername(req.username());
        u.setPasswordHash(passwordEncoder.encode(req.password()));
        u.setEmail(req.email());

        // Convertimos el texto desde el request a Enum con el prefijo ROLE_
        if ("ADMIN".equalsIgnoreCase(req.role())) {
            u.setRoles(Set.of(Role.ROLE_ADMIN));
        } else {
            u.setRoles(Set.of(Role.ROLE_USER));
        }

        userRepo.save(u);

        return ResponseEntity.ok(Map.of("message","registered"));
    }

    // ELIMINAR USUARIO (solo admin)
    @Autowired
    private TransactionRepository txRepo;
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id, Authentication auth) {

        var username = auth.getName();
        var currentUser = userRepo.findByUsername(username).orElseThrow();

        boolean isAdmin = currentUser.getRoles().stream()
                .anyMatch(r -> r.name().equals("ROLE_ADMIN"));

        if (!isAdmin)
            return ResponseEntity.status(403).body(Map.of("message", "not allowed"));

        if (currentUser.getId().equals(id))
            return ResponseEntity.badRequest().body(Map.of("message", "No puedes eliminar tu propio usuario"));

        boolean hasTransactions = txRepo.existsByUserId(id);
        if (hasTransactions)
            return ResponseEntity.badRequest().body(Map.of("message", "El usuario tiene transacciones y no puede ser eliminado"));

        
        userRepo.deleteById(id);
        return ResponseEntity.ok(Map.of("message","deleted"));
    }
    //Editar Usuario
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            String newUsername = body.get("username");
            if (newUsername == null || newUsername.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "El nombre no puede estar vacío"));
            }

            var user = userRepo.findById(id).orElse(null);
            if (user == null) return ResponseEntity.status(404).body(Map.of("message", "Usuario no encontrado"));

            // Verificar si alguien más ya tiene ese username
            var exists = userRepo.findByUsername(newUsername);
            if (exists.isPresent() && !exists.get().getId().equals(id)) {
                return ResponseEntity.badRequest().body(Map.of("message", "El nombre ya está en uso"));
            }

            user.setUsername(newUsername);
            userRepo.save(user);

            return ResponseEntity.ok(Map.of("message", "Usuario actualizado correctamente"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Error al actualizar usuario"));
        }
    }

    /*
    @PostMapping("/api/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createUser(@RequestBody @Valid UserRequest req) {
        if(userRepository.findByUsername(req.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Usuario ya existe"));
        }
        User user = new User();
        user.setUsername(req.getUsername());
        user.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        user.setRoles(Set.of(Role.valueOf(req.getRole()))); // Role enum
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("id", user.getId(), "username", user.getUsername(), "role", req.getRole()));
    }
        */
    

}
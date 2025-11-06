package com.payments.security;


import com.payments.repository.UserRepository;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    public JwtAuthFilter(JwtService jwtService, UserRepository userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        String token = null;

        // Obtener token desde cookie
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("token".equals(cookie.getName())) {
                    token = cookie.getValue();
                }
            }
        }

        if (token != null && jwtService.validateToken(token)) {
            String username = jwtService.getUsername(token);

            var user = userRepository.findByUsername(username);
            if (user.isPresent()) {
                List<SimpleGrantedAuthority> authorities = user.get().getRoles()
                        .stream()
                        .map(role -> new SimpleGrantedAuthority(role.name()))
                        .collect(Collectors.toList());

                var auth = new UsernamePasswordAuthenticationToken(
                    username,
                    null,
                    user.get().getRoles().stream()
                        .map(role -> new SimpleGrantedAuthority(role.name())) // <--- CORRECTO
                        .toList()
                );
                /*
                var auth = new UsernamePasswordAuthenticationToken(
                    user.get().getUsername(), // ← Aquí cambiamos, antes usabas username de token
                    null,
                    authorities
                );
                */    
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }

        chain.doFilter(request, response);
    }
}
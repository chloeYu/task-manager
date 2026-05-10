package com.bokyungyu.taskmanager.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.bokyungyu.taskmanager.model.dto.AuthResponse;
import com.bokyungyu.taskmanager.model.dto.SignupRequest;
import com.bokyungyu.taskmanager.model.dto.AuthRequest;
import com.bokyungyu.taskmanager.model.entity.User;
import com.bokyungyu.taskmanager.model.enums.Role;
import com.bokyungyu.taskmanager.repository.UserRepository;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtService jwtService;

    public ResponseEntity<AuthResponse> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        if (!(auth.getPrincipal() instanceof Long)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid User");
        }
        Long userId = (Long) auth.getPrincipal();
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok()
                .body(new AuthResponse(user.getName(), user.getEmail()));
    }

    public ResponseEntity<AuthResponse> login(AuthRequest request) {
        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(request.getEmail(),
                request.getPassword());
        authenticationManager.authenticate(token);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();
        String jwt = jwtService.generate(user);
        // Create the cookie
        ResponseCookie cookie = ResponseCookie.from("jwt", jwt)
                .httpOnly(true) // Prevents JavaScript access (XSS protection)
                .secure(true) // Only send over HTTPS (use false for local dev without SSL)
                .path("/") // Available for all routes
                .maxAge(24 * 60 * 60) // 24 hours
                .sameSite("Lax") // CSRF protection
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new AuthResponse(user.getName(), user.getEmail()));

    }

    public ResponseEntity<String> logout() {
        ResponseCookie cookie = ResponseCookie.from("jwt", null)
                .path("/")
                .httpOnly(true)
                .maxAge(0) // Expire immediately
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body("Logged out successfully");
    }

    public User signup(SignupRequest user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email has been taken");
        }
        User newUser = new User();
        newUser.setEmail(user.getEmail());
        newUser.setName(user.getName());
        newUser.setPassword(passwordEncoder.encode(user.getPassword()));
        newUser.setRole(Role.USER);
        return userRepository.save(newUser);
    }
}

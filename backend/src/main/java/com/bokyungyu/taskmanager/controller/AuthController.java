package com.bokyungyu.taskmanager.controller;

import java.net.http.HttpResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bokyungyu.taskmanager.model.dto.AuthResponse;
import com.bokyungyu.taskmanager.model.dto.SignupRequest;
import com.bokyungyu.taskmanager.model.dto.AuthRequest;
import com.bokyungyu.taskmanager.model.entity.User;
import com.bokyungyu.taskmanager.service.AuthService;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;

    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> getCurrentUser() {
        return authService.getCurrentUser();
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        return authService.login(request);
    }

    @PostMapping("/signup")
    public User signup(@RequestBody SignupRequest user) {
        return this.authService.signup(user);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        return this.authService.logout();
    }

}

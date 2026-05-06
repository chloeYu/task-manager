package com.bokyungyu.taskmanager.controller;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.bokyungyu.taskmanager.model.dto.LoginRequest;
import com.bokyungyu.taskmanager.model.entity.User;
import com.bokyungyu.taskmanager.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public User login(@RequestBody LoginRequest request) {
        return this.authService.login(request.getEmail(), request.getPassword());
    }

    @PostMapping("/signup")
    public User signup(@RequestBody User user) {
        return this.authService.signup(user);
    }
}

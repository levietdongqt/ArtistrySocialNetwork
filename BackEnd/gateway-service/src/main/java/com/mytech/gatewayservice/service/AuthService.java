package com.mytech.gatewayservice.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private JwtService jwtService;

    public void validateToken(String token) {
        jwtService.validateToken(token);
    }

}

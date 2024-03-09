package com.mytech.authservice.service;

import com.mytech.authservice.model.UserCredential;
import com.mytech.authservice.repository.IUserCredentialRepo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class AuthService {

    @Autowired
    private IUserCredentialRepo userCredentialRepo;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtService jwtService;
    public String createUser(UserCredential user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userCredentialRepo.save(user);
        return "User added to this system";
    }

    public String generateToken(String username) {
            return jwtService.generateToken(username);
    }

    public void validateToken(String token) {
        jwtService.validateToken(token);
    }

}

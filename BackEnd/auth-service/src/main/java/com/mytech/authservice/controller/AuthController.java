package com.mytech.authservice.controller;

import com.mytech.authservice.dto.AuthRequest;
import com.mytech.authservice.model.UserCredential;
import com.mytech.authservice.service.AuthService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("")
@Slf4j
public class AuthController {
    @Autowired
    private AuthService service;

    @Autowired
    private AuthenticationManager authenticationManager;


    @PostMapping("/login")
    public String login(@RequestBody AuthRequest authRequest) {
        Authentication authenticate = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        authRequest.getEmail(), authRequest.getPassword()));
        if (authenticate.isAuthenticated()) {
            return service.generateToken(authRequest.getEmail());
        } else {
            throw new RuntimeException("invalid access");
        }
    }

    @PostMapping("/register")
    public String addNewUser(@RequestBody UserCredential user) {
        return service.createUser(user);
    }
    @GetMapping("/hello")
    public String hello() {
        return "Hello form AUTHENTICATION SERVICE";
    }

    @GetMapping("/error/{isError}")
    public String error(@PathVariable("isError") boolean isError) throws RuntimeException {
        log.error("Vooooo roi");
        if (isError) {
            throw new RuntimeException("UnAuthorized roi nheeee!");
        }
        return "aaaaaaaaaaaaaaaaaaaaaaaaaaa";
    }
}

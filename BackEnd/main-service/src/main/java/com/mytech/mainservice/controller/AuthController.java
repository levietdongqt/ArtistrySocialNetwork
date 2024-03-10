package com.mytech.mainservice.controller;


import com.mytech.mainservice.dto.LoginDTO;
import com.mytech.mainservice.dto.RegisterDto;
import com.mytech.mainservice.model.User;
import com.mytech.mainservice.service.implement.AuthService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("auth")
@Slf4j
public class AuthController {
    @Autowired
    private AuthService service;

    @Autowired
    private AuthenticationManager authenticationManager;


    @PostMapping("/login")
    public String login(@RequestBody LoginDTO loginDTO) {
        Authentication authenticate = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDTO.getEmail(), loginDTO.getPassword()));
        if (authenticate.isAuthenticated()) {
            return service.generateToken(loginDTO.getEmail());
        } else {
            throw new RuntimeException("invalid access");
        }
    }

    @PostMapping("/register")
    public String addNewUser() {
        log.info("Vo   Register --------------");
        return "service.createUser(user);";
    }
    @GetMapping("/hello")
    public String hello() {
        return "Hello form AUTHENTICATION SERVICE";
    }

    @GetMapping("/error/{isError}")
    public String error(@PathVariable("isError") boolean isError) throws RuntimeException {
        if (isError) {
            throw new AuthenticationCredentialsNotFoundException("You don't have permission to access this'");
        }
        return "aaaaaaaaaaaaaaaaaaaaaaaaaaa";
    }
}

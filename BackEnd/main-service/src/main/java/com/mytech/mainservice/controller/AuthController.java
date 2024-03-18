package com.mytech.mainservice.controller;


import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.auth.oauth2.AccessToken;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.auth.*;
import com.google.firebase.auth.internal.FirebaseCustomAuthToken;
import com.mytech.mainservice.config.CustomUserDetail;
import com.mytech.mainservice.dto.LoginDTO;
import com.mytech.mainservice.dto.RegisterDto;
import com.mytech.mainservice.dto.ResponseObject;
import com.mytech.mainservice.exception.myException.UnAuthenticationException;
import com.mytech.mainservice.model.Session;
import com.mytech.mainservice.model.User;
import com.mytech.mainservice.service.IAuthService;
import com.mytech.mainservice.service.IUserService;
import lombok.extern.slf4j.Slf4j;
import org.checkerframework.checker.units.qual.A;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@RestController
@RequestMapping("auth")
@Slf4j
public class AuthController {
    @Autowired
    private IAuthService authService;

    @Autowired
    private IUserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) throws UnAuthenticationException {
        Authentication authenticate = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDTO.getEmail(), loginDTO.getPassword()));
        if (authenticate.isAuthenticated()) {
            CustomUserDetail userDetail = (CustomUserDetail) authenticate.getPrincipal();

            HashMap<String, Object> response = new HashMap<String, Object>();
            response.put("accessToken", authService.generateAccessToken(userDetail));
            response.put("refreshToken", authService.generateSession(loginDTO.getEmail()).getRefreshToken());
            return ResponseEntity.status(HttpStatus.OK).body(
                    ResponseObject.builder()
                            .status(HttpStatus.OK)
                            .message("Login successful")
                            .data(response)
                            .build()
            );
        } else {
            throw new UnAuthenticationException("User name or password incorrect");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> addNewUser(@RequestBody RegisterDto registerDTO) throws UnAuthenticationException {
        User savedUser = userService.createUser(registerDTO);
        HashMap<String, Object> response = getRegisterResponse(savedUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ResponseObject.builder()
                        .status(HttpStatus.CREATED)
                        .message("User added to this system")
                        .data(response)
                        .build()
        );
    }


    @PostMapping("/register/oauth2")
    public ResponseEntity<?> oauth2Handle(@RequestParam("token") String token) throws FirebaseAuthException, UnAuthenticationException {

        UserInfo userInfo = authService.firebaseHandler(token);
        userService.checkExistUser(userInfo);
        User savedUser = userService.createUser(userInfo);
        HashMap<String, Object> response = getRegisterResponse(savedUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ResponseObject.builder()
                        .status(HttpStatus.CREATED)
                        .message("Oauth2 with Google successfully")
                        .data(response)
                        .build()
        );
    }

    @PostMapping("/refreshToken")
    public ResponseEntity<?> freshToken(@RequestParam("refreshToken") String refreshToken) throws UnAuthenticationException {
        Session session = authService.checkRefreshToken(refreshToken);
        String newRefreshToken = session.getRefreshToken();
        String accessToken = authService.generateAccessToken(session.getUser().getEmail());
        HashMap<String, String> response = new HashMap<String, String>();
        response.put("accessToken", accessToken);
        response.put("refreshToken", newRefreshToken);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Refresh token is valid")
                        .data(response)
                        .build()
        );
    }

    @Secured("ROLE_ADMIN")
    @GetMapping("/hello")
    public String hello() {
        log.debug("Voo hello!!!!!!!!!!!!!!!!!!");
        return "Hello form AUTHENTICATION authService";
    }

    @GetMapping("/error/{isError}")
    public String error(@PathVariable("isError") boolean isError) throws RuntimeException, UnAuthenticationException {
        if (isError) {
            throw new UnAuthenticationException("You don't have permission to access this'");
        }
        return "aaaaaaaaaaaaaaaaaaaaaaaaaaa";
    }

    private HashMap<String, Object> getRegisterResponse(User savedUser) {
        String accessToken = authService.generateAccessToken(savedUser);
        String refreshToken = authService.generateSession(savedUser).getRefreshToken();
        HashMap<String, Object> response = new HashMap<String, Object>();
        response.put("accessToken", accessToken);
        response.put("refreshToken", refreshToken);
        response.put("user", savedUser);
        return response;
    }
}

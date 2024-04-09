package com.mytech.mainservice.controller;


import com.google.firebase.auth.*;
import com.mytech.mainservice.config.CustomUserDetail;
import com.mytech.mainservice.dto.UserDTO;
import com.mytech.mainservice.dto.request.FriendDTO;
import com.mytech.mainservice.dto.request.LoginDTO;
import com.mytech.mainservice.dto.request.RegisterDto;
import com.mytech.mainservice.dto.ResponseObject;
import com.mytech.mainservice.dto.request.TokenDTO;
import com.mytech.mainservice.exception.myException.UnAuthenticationException;
import com.mytech.mainservice.helper.JwtService;
import com.mytech.mainservice.model.Session;
import com.mytech.mainservice.model.User;
import com.mytech.mainservice.service.IAuthService;
import com.mytech.mainservice.service.IUserService;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
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

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    JwtService jwtService;


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) throws UnAuthenticationException {
        Authentication authenticate = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDTO.email(), loginDTO.password()));
        if (authenticate.isAuthenticated()) {
            CustomUserDetail userDetail = (CustomUserDetail) authenticate.getPrincipal();
            HashMap<String, Object> response = getAuthResponse(userDetail.getUser());
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
        HashMap<String, Object> response = getAuthResponse(savedUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ResponseObject.builder()
                        .status(HttpStatus.CREATED)
                        .message("User added to this system")
                        .data(response)
                        .build()
        );
    }

    @PostMapping("/register/oauth2")
    public ResponseEntity<?> oauth2Handle(@RequestBody TokenDTO tokenDTO) throws FirebaseAuthException, UnAuthenticationException {
        HashMap<String, Object> response = new HashMap<String, Object>();
        UserInfo userInfo = authService.firebaseHandler(tokenDTO.token());
        User exisUser = userService.existUser(userInfo);
        if (exisUser == null) {
            User savedUser = userService.createUser(userInfo);
            response = getAuthResponse(savedUser);
        } else {
            response = getAuthResponse(exisUser);
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ResponseObject.builder()
                        .status(HttpStatus.CREATED)
                        .message("Oauth2 with Google successfully")
                        .data(response)
                        .build()
        );
    }

    @PostMapping("/refreshToken")
    public ResponseEntity<?> freshToken(@RequestBody TokenDTO tokenDTO) throws UnAuthenticationException {


        Session session = authService.checkRefreshToken(tokenDTO.token());
        String newRefreshToken = session.getRefreshToken();
        String accessToken = authService.generateAccessToken(session.getUser());
        HashMap<String, String> response = new HashMap<String, String>();
        response.put("accessToken", accessToken);
        response.put("refreshToken", tokenDTO.token());
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Refresh token is valid")
                        .data(response)
                        .build()
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/hello")
    public ResponseEntity<?> hello() {
        log.debug("Voo hello!!!!!!!!!!!!!!!!!!");
        HashMap<String, String> response = new HashMap<String, String>();
        response.put("hello", "HELLO FROM MAIN AUTH CONTROLLER");
        return ResponseEntity.ok().body(
                response
        );
    }

    //    @PreAuthorize("#friendDTO.userId.equals(@jwtTokenHolder.getUserId()) && hasRole('ADMIN')")
    @PreAuthorize("@jwtTokenHolder.isValidUserId(#friendDTO.userId) && hasRole('ADMIN')")
    @PostMapping("/hello2")
    public ResponseEntity<?> hello2(@RequestBody FriendDTO friendDTO) {
        log.debug("Voo hello!!!!!!!!!!!!!!!!!!");
        HashMap<String, String> response = new HashMap<String, String>();
        response.put("hello", "HELLO FROM MAIN AUTH CONTROLLER");
        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/error/{isError}")
    public String error(@PathVariable("isError") boolean isError) throws RuntimeException, UnAuthenticationException {
        if (isError) {
            throw new UnAuthenticationException("You don't have permission to access this'");
        }
        return "aaaaaaaaaaaaaaaaaaaaaaaaaaa";
    }

    private HashMap<String, Object> getAuthResponse(User savedUser) {
        String accessToken = authService.generateAccessToken(savedUser);
        String refreshToken = authService.generateSession(savedUser).getRefreshToken();
        UserDTO userDTO = modelMapper.map(savedUser, UserDTO.class);
        HashMap<String, Object> response = new HashMap<String, Object>();
        response.put("accessToken", accessToken);
        response.put("refreshToken", refreshToken);
        response.put("user", userDTO);
        return response;
    }
}

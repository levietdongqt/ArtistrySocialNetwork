package com.mytech.mainservice.controller;


import com.mytech.mainservice.dto.LoginDTO;
import com.mytech.mainservice.dto.RegisterDto;
import com.mytech.mainservice.dto.ResponseObject;
import com.mytech.mainservice.exception.myException.UnAuthenticationException;
import com.mytech.mainservice.model.Session;
import com.mytech.mainservice.model.User;
import com.mytech.mainservice.service.IAuthService;
import com.mytech.mainservice.service.implement.AuthService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("auth")
@Slf4j
public class AuthController {
    @Autowired
    private IAuthService authService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/login")
    public String login(@RequestBody LoginDTO loginDTO) throws UnAuthenticationException {
        Authentication authenticate = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDTO.getEmail(), loginDTO.getPassword()));
        if (authenticate.isAuthenticated()) {
            return authService.generateToken(loginDTO.getEmail());
        } else {
            throw new UnAuthenticationException("User name or password incorrect");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> addNewUser(@RequestBody  RegisterDto registerDTO) throws UnAuthenticationException {
        User savedUser =  authService.createUser(registerDTO);
        String accessToken = authService.generateToken(savedUser.getEmail());
        String refreshToken = authService.generateSession(savedUser).getRefreshToken();
        HashMap<String,Object> response = new HashMap<String,Object>();
        response.put("accessToken",accessToken);
        response.put("refreshToken",refreshToken);
        response.put("user",savedUser);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                      .status(HttpStatus.OK)
                      .message("User added to this system")
                      .data(response)
                      .build()
        );
    }
    @PostMapping("/refreshToken")
    public ResponseEntity<?> freshToken(@RequestParam("refreshToken") String refreshToken) throws UnAuthenticationException {
       Session session = authService.checkRefreshToken(refreshToken);
       String newRefreshToken = session.getRefreshToken();
       String accessToken = authService.generateToken(session.getUser().getEmail());
       HashMap<String,String> response = new HashMap<String,String>();
       response.put("accessToken",accessToken);
       response.put("refreshToken",newRefreshToken);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                    .status(HttpStatus.OK)
                    .message("Refresh token is valid")
                    .data(response)
                    .build()
        );
    }

    @Secured("ROLE_STUDIO")
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
}

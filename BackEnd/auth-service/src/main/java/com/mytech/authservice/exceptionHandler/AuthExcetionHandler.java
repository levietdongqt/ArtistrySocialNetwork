package com.mytech.authservice.exceptionHandler;


import lombok.extern.log4j.Log4j;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@Slf4j
public class AuthExcetionHandler {

    @ExceptionHandler(RuntimeException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ResponseEntity<?> AuthExcetionHandler(RuntimeException exception){
        log.error("Nguuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu");
            return ResponseEntity.badRequest().body(exception.getMessage());
    }
}

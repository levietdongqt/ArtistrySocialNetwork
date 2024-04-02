package com.mytech.mainservice.exception.handler;


import com.google.firebase.auth.FirebaseAuthException;
import com.mytech.mainservice.dto.ResponseObject;
import com.mytech.mainservice.exception.myException.ForbiddenException;
import com.mytech.mainservice.exception.myException.TokenExpiredException;
import com.mytech.mainservice.exception.myException.UnAuthenticationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Arrays;

@RestControllerAdvice
@Slf4j
public class AuthExceptionHandler {

    @ExceptionHandler(TokenExpiredException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ResponseEntity<?> AuthExceptionHandle(TokenExpiredException exception) {
        log.error(Arrays.toString(exception.getStackTrace()));
        return ResponseEntity.badRequest().body(
                ResponseObject.builder().
                        status(HttpStatus.UNAUTHORIZED)
                        .message(exception.getMessage())
                        .data(null).build());
    }

    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ResponseEntity<?> AuthExceptionHandle(AccessDeniedException exception) {
        log.error(Arrays.toString(exception.getStackTrace()));
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                ResponseObject.builder().
                        status(HttpStatus.FORBIDDEN)
                        .message(exception.getMessage())
                        .data(null).build());
    }

    @ExceptionHandler(RuntimeException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<?> AuthExceptionHandle(RuntimeException exception) {
        log.error(Arrays.toString(exception.getStackTrace()));
        return ResponseEntity.badRequest().body(
                ResponseObject.builder().
                        status(HttpStatus.BAD_REQUEST)
                        .message(exception.getMessage())
                        .data(null).build());
    }

    @ExceptionHandler(FirebaseAuthException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<?> firebaseAuthExceptionHandle(FirebaseAuthException exception) {
        log.error(exception.toString());
        return ResponseEntity.badRequest().body(
                ResponseObject.builder().
                        status(HttpStatus.BAD_REQUEST)
                        .message(exception.getMessage())
                        .data(null).build());
    }

    @ExceptionHandler(UnAuthenticationException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ResponseEntity<?> AuthExceptionHandle2(UnAuthenticationException exception) {

        log.error(Arrays.toString(exception.getStackTrace()));
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                ResponseObject.builder().
                        status(HttpStatus.UNAUTHORIZED)
                        .message(exception.getMessage())
                        .data(null).build());
    }
}

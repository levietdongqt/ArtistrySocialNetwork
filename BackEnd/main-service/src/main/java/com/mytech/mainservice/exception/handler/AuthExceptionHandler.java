package com.mytech.mainservice.exception.handler;


import com.google.firebase.auth.FirebaseAuthException;
import com.mytech.mainservice.dto.ResponseObject;
import com.mytech.mainservice.exception.myException.UnAuthenticationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Arrays;

@RestControllerAdvice
@Slf4j
public class AuthExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<?> AuthExceptionHandle(RuntimeException exception){
        log.error(Arrays.toString(exception.getStackTrace()));
            return ResponseEntity.badRequest().body(
                    ResponseObject.builder().
                            status(HttpStatus.BAD_REQUEST)
                            .message(exception.getMessage())
                            .data(null).build());
    }

    @ExceptionHandler(FirebaseAuthException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<?> firebaseAuthExceptionHandle(FirebaseAuthException exception){
        log.error(exception.toString());
        return ResponseEntity.badRequest().body(
                ResponseObject.builder().
                        status(HttpStatus.BAD_REQUEST)
                        .message(exception.getMessage())
                        .data(null).build());
    }

    @ExceptionHandler(UnAuthenticationException.class)
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<?> AuthExceptionHandle2(UnAuthenticationException exception){

        log.error(Arrays.toString(exception.getStackTrace()));
        return ResponseEntity.badRequest().body(
                ResponseObject.builder().
                        status(HttpStatus.UNAUTHORIZED)
                        .message(exception.getMessage())
                        .data(null).build());
    }
}

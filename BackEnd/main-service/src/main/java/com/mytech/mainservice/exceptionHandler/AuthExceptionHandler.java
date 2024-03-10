package com.mytech.mainservice.exceptionHandler;


import com.mytech.mainservice.dto.ResponseObject;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@Slf4j
public class AuthExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<?> AuthExceptionHandle(RuntimeException exception){
            return ResponseEntity.badRequest().body(
                    ResponseObject.builder().
                            status(HttpStatus.BAD_REQUEST)
                            .message(exception.getMessage())
                            .data(null).build());
    }
}

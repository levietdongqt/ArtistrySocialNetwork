package com.mytech.mainservice.exception.handler;

import com.mytech.mainservice.dto.ResponseObject;
import com.mytech.mainservice.exception.myException.NotFoundException;
import com.mytech.mainservice.exception.myException.TokenExpiredException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Arrays;

@RestControllerAdvice
@Slf4j
public class NotFoundExceptionHandler {
    @ExceptionHandler(NotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ResponseEntity<?> AuthExceptionHandle(NotFoundException exception) {
        log.error(Arrays.toString(exception.getStackTrace()));
        return ResponseEntity.badRequest().body(
                ResponseObject.builder().
                        status(HttpStatus.NOT_FOUND)
                        .message(exception.getMessage())
                        .data(null).build());
    }

}

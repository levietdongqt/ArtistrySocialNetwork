package com.mytech.mainservice.exception.myException;

public class InvalidPropertyException extends  RuntimeException {
    public InvalidPropertyException(String message) {
        super(message);
    }
}

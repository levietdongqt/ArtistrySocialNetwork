package com.mytech.mainservice.controller;


import com.mytech.mainservice.exception.myException.ForbiddenException;
import com.mytech.mainservice.exception.myException.TokenExpiredException;
import com.mytech.mainservice.exception.myException.UnAuthenticationException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/exception")
public class ExceptionController {

    @GetMapping("/{status}")
    public String error(@PathVariable("status") int status)  {
        if (status == 401) {
            throw new TokenExpiredException("You don't have permission to access this'");
        }
        if (status == 403) {
            throw new ForbiddenException("You don't have permission to access this'");
        }
        return "aaaaaaaaaaaaaaaaaaaaaaaaaaa";
    }

}

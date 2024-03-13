package com.mytech.mainservice.service;

import com.mytech.mainservice.dto.RegisterDto;
import com.mytech.mainservice.exception.myException.UnAuthenticationException;
import com.mytech.mainservice.model.Session;
import com.mytech.mainservice.model.User;

import java.util.List;

public interface IAuthService {
    public Session checkRefreshToken(String freshToken) throws UnAuthenticationException;
    public Session generateSession(User user);
    public String generateToken(String username);

    public User createUser(RegisterDto userRegister) throws UnAuthenticationException;
}

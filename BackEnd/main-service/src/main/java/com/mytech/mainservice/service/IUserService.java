package com.mytech.mainservice.service;

import com.google.firebase.auth.FirebaseToken;
import com.google.firebase.auth.UserInfo;
import com.mytech.mainservice.dto.RegisterDto;
import com.mytech.mainservice.exception.myException.UnAuthenticationException;
import com.mytech.mainservice.model.User;

import java.util.List;

public interface IUserService {
    public void checkExistUser(UserInfo userInfo) throws UnAuthenticationException;
    public User getUserById(String userId);

    public User createUser(RegisterDto userRegister) throws UnAuthenticationException;
    String getRandomId();

    User createUser(UserInfo userInfo) throws UnAuthenticationException;
}

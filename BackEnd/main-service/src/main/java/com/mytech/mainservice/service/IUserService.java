package com.mytech.mainservice.service;

import com.google.firebase.auth.UserInfo;
import com.mytech.mainservice.dto.UserDTO;
import com.mytech.mainservice.dto.request.RegisterDto;
import com.mytech.mainservice.exception.myException.UnAuthenticationException;
import com.mytech.mainservice.model.User;

public interface IUserService {
    public User existUser(UserInfo userInfo) throws UnAuthenticationException;
    public UserDTO getUserById(String userId);

    public User createUser(RegisterDto userRegister) throws UnAuthenticationException;
    String getRandomId();

    User createUser(UserInfo userInfo) throws UnAuthenticationException;
}

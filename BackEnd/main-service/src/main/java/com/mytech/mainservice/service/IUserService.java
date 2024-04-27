package com.mytech.mainservice.service;

import com.google.firebase.auth.UserInfo;
import com.mytech.mainservice.dto.FriendDTO;
import com.mytech.mainservice.dto.UserDTO;
import com.mytech.mainservice.dto.request.LoginDTO;
import com.mytech.mainservice.dto.request.RegisterDto;
import com.mytech.mainservice.exception.myException.UnAuthenticationException;
import com.mytech.mainservice.model.User;

import java.util.List;

public interface IUserService {
    public User existUser(UserInfo userInfo) throws UnAuthenticationException;
    public UserDTO getUserById(String userId);

    public User createUser(RegisterDto userRegister) throws UnAuthenticationException;
    String getRandomId();

    User createUser(UserInfo userInfo) throws UnAuthenticationException;

    public void updateHistorySearch(String userId,String keyword);

    public List<String> getHistorySearch(String userId);
    User getUserByPhoneNumber(String phoneNumber);

    void verifyPhone(String phoneNumber);

    void changePass(LoginDTO data);

    public void deleteHistory(String userId,String history);

    public void deleteAllHistory(String userId);

    public void updateUser(UserDTO user);

}

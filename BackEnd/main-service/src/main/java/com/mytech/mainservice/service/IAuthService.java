package com.mytech.mainservice.service;

import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserInfo;
import com.mytech.mainservice.config.CustomUserDetail;
import com.mytech.mainservice.exception.myException.UnAuthenticationException;
import com.mytech.mainservice.model.Session;
import com.mytech.mainservice.model.User;

public interface IAuthService {
    public Session checkRefreshToken(String freshToken) throws UnAuthenticationException;

    public Session generateSession(User user);

    public Session generateSession(String userId);

    public UserInfo firebaseHandler(String token) throws FirebaseAuthException;

    public String generateAccessToken(User user);



}

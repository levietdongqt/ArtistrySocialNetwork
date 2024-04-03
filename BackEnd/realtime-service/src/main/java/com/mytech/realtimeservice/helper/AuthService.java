package com.mytech.realtimeservice.helper;

import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private String authToken;

    public void setAuthToken(String token) {
        this.authToken = token;
    }

    public String getAuthToken() {
        return this.authToken;
    }

}

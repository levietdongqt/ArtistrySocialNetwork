package com.mytech.realtimeservice.helper;

import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Component;
import org.springframework.web.context.WebApplicationContext;

@Component
@Scope(scopeName = WebApplicationContext.SCOPE_REQUEST, proxyMode = ScopedProxyMode.TARGET_CLASS)
public class JwtTokenHolder {
    @Autowired
    private JwtService jwtService;
    @Getter
    @Setter
    private String currentToken;

    public String getUserId() {
        return jwtService.extractUserId(currentToken);
    }

    public boolean isValidUserId(String userId) {
        return jwtService.extractUserId(currentToken).equals(userId);
    }

}

package com.mytech.realtimeservice.configs;

import com.mytech.realtimeservice.helper.JwtService;
import com.mytech.realtimeservice.helper.JwtTokenHolder;
import com.sun.security.auth.UserPrincipal;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

import java.security.Principal;
import java.util.Arrays;
import java.util.Map;

@Slf4j
@Component
public class UserHandshakeHandler extends DefaultHandshakeHandler {
    private JwtService jwtService;

    UserHandshakeHandler(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected Principal determineUser(
            ServerHttpRequest request, WebSocketHandler wsHandler, Map<String, Object> attributes) {
        var cookies = request.getHeaders().get("cookie").get(0).split(";");
        var accessToken = Arrays.stream(cookies)
                .filter(s -> s.contains("access_token"))
                .findAny().get()
                .split("=")[1];
        try {
            String userId = jwtService.extractUserId(accessToken);
            log.info("User with id '{}' opened ", userId);
            return new UserPrincipal(userId);
        } catch (Exception e) {
            log.error(e.getMessage());
            return null;
        }
    }
}

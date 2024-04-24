package com.mytech.realtimeservice.configs;

import com.sun.security.auth.UserPrincipal;
import lombok.extern.slf4j.Slf4j;
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
    @Override
    protected Principal determineUser(
            ServerHttpRequest request, WebSocketHandler wsHandler, Map<String, Object> attributes) {
        var headers = request.getHeaders();
        var token = request.getHeaders().get("cookie").get(0);
        var userIdCookie = Arrays.stream(token.split(";")).filter(s -> s.contains("userId")).findAny().get();
        String userId = userIdCookie.substring(8);
        log.info("User with id '{}' opened ", userId);
        return new UserPrincipal(userId);
    }
}

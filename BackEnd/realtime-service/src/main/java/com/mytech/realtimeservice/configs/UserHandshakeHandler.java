package com.mytech.realtimeservice.configs;

import com.mytech.realtimeservice.controller.WSController;
import com.mytech.realtimeservice.filter.JwtAuthFilter;
import com.mytech.realtimeservice.helper.JwtService;
import com.mytech.realtimeservice.helper.JwtTokenHolder;
import com.sun.security.auth.UserPrincipal;
import lombok.extern.slf4j.Slf4j;
import org.apache.logging.log4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

import java.security.Principal;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Component
public class UserHandshakeHandler extends DefaultHandshakeHandler {
    @Override
    protected Principal determineUser(
            ServerHttpRequest request, WebSocketHandler wsHandler, Map<String, Object> attributes) {
        System.out.println("Vo ne");


        var token = request.getHeaders().get("cookie").get(0);
        log.info("Access token",token);
        String[] tokens = token.split(";");
        String userId = tokens[3];
        log.info("User with id '{}' opened ",userId);
        String userIdNew = userId.substring(8);
//        var bool = jwtService.validateToken(accessToken);
      log.info("User with id '{}' opened ",userIdNew);
        return new UserPrincipal(userIdNew);
    }
}

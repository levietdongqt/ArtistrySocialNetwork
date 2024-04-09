package com.mytech.realtimeservice.configs;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
@Slf4j
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Value("${env.CLIENT_URL}")
    private String clientUrl;
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic"); // Định tuyến thông báo đến "/topic"
        config.setApplicationDestinationPrefixes("/app"); // Thiết lập tiền tố của các đường dẫn được xử lý bởi @MessageMapping
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        log.info("Registering endpoint");
        registry.addEndpoint("/api/realtime/socket.io")
                .withSockJS(); // Đăng ký WebSocket endpoint tại "/ws" với SockJS
    }
}

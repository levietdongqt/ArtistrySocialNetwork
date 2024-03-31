package com.mytech.realtimeservice.configs;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
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
        registry.addEndpoint("/ws")
                .setAllowedOrigins(clientUrl)
                .setHandshakeHandler(new UserHandshakeHandler())
                .withSockJS(); // Đăng ký WebSocket endpoint tại "/ws" với SockJS
    }
}

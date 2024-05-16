package com.mytech.realtimeservice.configs;

import com.mytech.realtimeservice.helper.JwtService;
import com.mytech.realtimeservice.helper.JwtTokenHolder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.server.HandshakeHandler;

@Configuration
@EnableWebSocketMessageBroker
@Slf4j
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Autowired
    private JwtService jwtService;
    @Autowired
    private UserHandshakeHandler userHandshakeHandler;
    @Value("${env.CLIENT_URL}")
    private String clientUrl;

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        log.info("Registering endpoint");
        config.enableSimpleBroker("/topic", "/chat"); // Định tuyến thông báo đến "/topic"
        config.setApplicationDestinationPrefixes("/app"); // Thiết lập tiền tố của các đường dẫn được xử lý bởi @MessageMapping
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        log.info("Registering endpoint");
        registry.addEndpoint("/socket.io")
                .setAllowedOrigins(clientUrl)
                .setAllowedOrigins("http://34.126.138.202")
                .setAllowedOrigins("http://host.docker.internal")
                .setHandshakeHandler(userHandshakeHandler);
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

                if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                    // Tìm và xác thực token.
                    String accessToken = accessor.getFirstNativeHeader("access_token");
                    if(accessToken == null) {
                        accessToken = accessor.getFirstNativeHeader("Authorization").substring(7);
                    }
                    try {
                        jwtService.validateToken(accessToken);
                    } catch (Exception e) {
                        log.error("Invalid token");
                        throw new IllegalArgumentException("Invalid access token");
                    }
                }

                return message;
            }
        });
    }
}

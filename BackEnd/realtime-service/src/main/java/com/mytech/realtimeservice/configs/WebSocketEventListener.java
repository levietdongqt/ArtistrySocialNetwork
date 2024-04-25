package com.mytech.realtimeservice.configs;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
@Slf4j
public class WebSocketEventListener {
    // Ví dụ, bạn có thể sử dụng một dịch vụ để quản lý trạng thái người dùng (chưa được triển khai trong ví dụ này)
    // @Autowired
    // private UserSessionService userSessionService;

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectEvent event) {
        SimpMessageHeaderAccessor headers = SimpMessageHeaderAccessor.wrap(event.getMessage());
        String userId = headers.getUser().getName(); // Lấy username hoặc user identifier từ header
        // userSessionService.setUserOnline(userId);
        log.warn("WebSocket connection Listener: " + userId);
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        SimpMessageHeaderAccessor headers = SimpMessageHeaderAccessor.wrap(event.getMessage());
        String userId = headers.getUser().getName(); // Lấy username hoặc user identifier từ header
        // userSessionService.setUserOffline(userId);
        log.warn("WebSocket Disconnect Listener: " + userId);

    }
}

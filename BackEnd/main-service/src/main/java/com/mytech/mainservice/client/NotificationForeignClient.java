package com.mytech.mainservice.client;

import com.mytech.mainservice.dto.NotificationDTO;
import com.mytech.mainservice.dto.UserDTO;
import com.mytech.mainservice.dto.foreignClient.ConversationDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@FeignClient (name="REALTIME-SERVICE")
public interface NotificationForeignClient {

    @PostMapping("/api/realtime/notifications/save-notifications")
    public ResponseEntity<?> saveNotification(@RequestBody NotificationDTO notificationDTO);

    @PostMapping("/api/realtime/conversation/check")
    void createConversation(ConversationDTO conversationDTO);

    @PostMapping("/api/realtime/posts/updates-users")
    public ResponseEntity<?> updateUserForRealtime(@RequestBody UserDTO userDTO);
}

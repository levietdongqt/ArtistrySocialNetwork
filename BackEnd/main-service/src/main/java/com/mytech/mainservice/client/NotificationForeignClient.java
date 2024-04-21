package com.mytech.mainservice.client;

import com.mytech.mainservice.dto.NotificationDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@FeignClient (name="REALTIME-SERVICE")
public interface NotificationForeignClient {

    @PostMapping("/api/realtime/notifications/save-notifications")
    public ResponseEntity<?> saveNotification(@RequestBody NotificationDTO notificationDTO);
}

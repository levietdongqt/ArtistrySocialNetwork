package com.mytech.realtimeservice.controller;

import com.mytech.realtimeservice.services.NotificationService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/notifications")
public class NotificationController {
    private NotificationService notificationService;

}

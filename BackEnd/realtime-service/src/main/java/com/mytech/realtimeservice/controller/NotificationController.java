package com.mytech.realtimeservice.controller;

import com.mytech.realtimeservice.dto.ResponseObject;
import com.mytech.realtimeservice.models.Notification;
import com.mytech.realtimeservice.models.Post;
import com.mytech.realtimeservice.models.users.User;
import com.mytech.realtimeservice.services.NotificationService;
import com.mytech.realtimeservice.services.PostService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("notifications")
@RequiredArgsConstructor
@Slf4j
public class NotificationController {
    @Autowired
    private NotificationService notificationService;

    @Autowired
    private PostService postService;



    @GetMapping
    public ResponseEntity<?> getNotifications() {
        List<Notification> notifications = notificationService.getNotificationsByUserFromUserIdOrderByCreatedDateDesc("user1");
        log.info("PostList",notifications);
        return ResponseEntity.status(HttpStatus.OK).body(
                ResponseObject.builder()
                        .status(HttpStatus.CREATED)
                        .message("Get post list OK")
                        .data(notifications)
                        .build()
        );
    }

}

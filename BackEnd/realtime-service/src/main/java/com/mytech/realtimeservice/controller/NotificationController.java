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
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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



    @GetMapping("/{userId}")
    public ResponseEntity<?> getNotifications(@PathVariable String userId) {
        List<Notification> notifications = notificationService.getNotificationsByUserFromUserIdOrderByCreatedDateDesc(userId);
        log.info("PostList",notifications);
        return ResponseEntity.status(HttpStatus.OK).body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Get post list OK")
                        .data(notifications)
                        .build()
        );
    }

    @GetMapping("/{userId}/all")
    public ResponseEntity<?> getAddNotifications(@PathVariable String userId) {
        List<Notification> notifications = notificationService.getNotificationsByUserFromUserId(userId);
        log.info("PostList",notifications);
        return ResponseEntity.status(HttpStatus.OK).body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Get notifications list OK")
                        .data(notifications)
                        .build()
        );
    }

    @PutMapping("/update/{notifID}")
    public ResponseEntity changeNotificationsStatusToRead(@PathVariable String notifID) {
        log.info("Notification changed",notifID);
        Notification notification = notificationService.changeNotifStatusToRead(notifID);

        return ResponseEntity.status(HttpStatus.OK).body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Updated status ok")
                        .data(notification)
                        .build()
        );
    }

    @GetMapping("/{userId}/count-notifications")
    public ResponseEntity countDeliveryNotifications(@PathVariable String userId) {
        int count = notificationService.CountNotificationsUnread(userId);
        return ResponseEntity.status(HttpStatus.OK).body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Count unread notifications ok")
                        .data(count)
                        .build()
        );
    }

    @PostMapping("/{userId}/change-delivery")
    public ResponseEntity changeDeliveryNotifications(@PathVariable String userId) {
        log.info("Notification changed");
        notificationService.changeNotifiDelivory(userId);
        return ResponseEntity.status(HttpStatus.OK).body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Updated delivery notifications ok")
                        .build()
        );
    }
}

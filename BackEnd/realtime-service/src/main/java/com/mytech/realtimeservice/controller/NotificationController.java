package com.mytech.realtimeservice.controller;


import com.mytech.realtimeservice.dto.NopeNotificationDTO;
import com.mytech.realtimeservice.dto.NotificationDTO;
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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
@Slf4j
public class NotificationController {
    @Autowired
    private NotificationService notificationService;


    @PreAuthorize("@jwtTokenHolder.isValidUserId(#userId) && hasRole('USER')")
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

    @PreAuthorize("@jwtTokenHolder.isValidUserId(#userId) && hasRole('USER')")
    @GetMapping("/{userId}/all")
    public ResponseEntity<?> getAllNotifications(@PathVariable String userId) {
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
    public ResponseEntity<?> changeNotificationsStatusToRead(@PathVariable String notifID) {
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

    @PutMapping("/list-update")
    public ResponseEntity<?> changeListNotificationsStatusToRead(@RequestBody List<String> listId) {
       notificationService.changeListNotifications(listId);

        return ResponseEntity.status(HttpStatus.OK).body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Change List Updated status ok")
                        .data(null)
                        .build()
        );
    }

    @PostMapping("/update-all")
    public ResponseEntity<?> changeAllNotificationsStatusToRead(@RequestBody List<String> listId) {
        notificationService.updateAllNotifications(listId);
        return ResponseEntity.status(HttpStatus.OK).body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Updated status ok")
                        .data(null)
                        .build()
        );
    }

    @PreAuthorize("@jwtTokenHolder.isValidUserId(#userId) && hasRole('USER')")
    @GetMapping("/{userId}/count-notifications")
    public ResponseEntity<?> countDeliveryNotifications(@PathVariable String userId) {
        int count = notificationService.CountNotificationsUnread(userId);
        return ResponseEntity.status(HttpStatus.OK).body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Count unread notifications ok")
                        .data(count)
                        .build()
        );
    }



    @PreAuthorize("@jwtTokenHolder.isValidUserId(#userId) && hasRole('USER')")
    @PostMapping("/{userId}/change-delivery")
    public ResponseEntity changeAllDeliveryNotifications(@PathVariable String userId) {
        log.info("Notification changed");
        notificationService.changeNotifiDelivory(userId);
        return ResponseEntity.status(HttpStatus.OK).body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Updated delivery notifications ok")
                        .build()
        );
    }
    @PostMapping("/save-notifications")
    public ResponseEntity<?> saveNotification(@RequestBody NotificationDTO notificationDTO) {
        notificationService.sendNotification(notificationDTO.getUserFrom(),notificationDTO.getUserTo(),notificationDTO.getNotificationType(),notificationDTO.getMessage(),notificationDTO.getLink());
        return ResponseEntity.status(HttpStatus.OK).body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Updated delivery notifications ok")
                        .build());
    }

    @PreAuthorize("@jwtTokenHolder.isValidUserId(#userId) && hasRole('USER')")
    @PostMapping("/{userId}/nope-notifications")
    public ResponseEntity<?> saveNopeNotification(@PathVariable String userId,@RequestBody NopeNotificationDTO nopeNotificationDTO) {
        notificationService.saveNopeNotification(nopeNotificationDTO);
        return ResponseEntity.status(HttpStatus.OK).body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("saved successfully")
                        .build());
    }

    @PreAuthorize("@jwtTokenHolder.isValidUserId(#userId) && hasRole('USER')")
    @PostMapping("/{userId}/check-nope-notifications")
    public ResponseEntity<?> checkNopeNotification(@PathVariable String userId,@RequestBody NopeNotificationDTO nopeNotificationDTO) {
        var check = notificationService.getNopeNotification(nopeNotificationDTO.getUserId(),nopeNotificationDTO.getNopeId());
        return ResponseEntity.status(HttpStatus.OK).body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("saved successfully")
                        .data(check)
                        .build());
    }

    @PreAuthorize("@jwtTokenHolder.isValidUserId(#userId) && hasRole('USER')")
    @PostMapping("/{userId}/delete-nope-notifications")
    public ResponseEntity<?> deleteNopeNotification(@PathVariable String userId,@RequestBody NopeNotificationDTO nopeNotificationDTO) {
        notificationService.deleteNopeNotification(nopeNotificationDTO.getUserId(),nopeNotificationDTO.getNopeId());
        return ResponseEntity.status(HttpStatus.OK).body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("deleted successfully")
                        .build());
    }

    @DeleteMapping("/delete/{notifID}")
    public ResponseEntity<?> deleteNotification(@PathVariable String notifID) {
        notificationService.deleteNotification(notifID);
        return ResponseEntity.status(HttpStatus.OK).body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("delete notification ok")
                        .data(null)
                        .build()
        );
    }


}

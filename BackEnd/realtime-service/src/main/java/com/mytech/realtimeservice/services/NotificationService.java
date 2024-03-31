package com.mytech.realtimeservice.services;

import com.mytech.realtimeservice.dto.ResponseMessage;
import com.mytech.realtimeservice.models.Notification;
import com.mytech.realtimeservice.models.users.User;
import com.mytech.realtimeservice.repositories.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;


    public List<Notification> getNotificationsByUserFromUserIdOrderByCreatedDateDesc(String userFrom) {
        return notificationRepository.findByUserFromUserIdOrderByCreatedDateDesc(userFrom);
    }

    public void saveNotification(Notification notification) {
        notificationRepository.save(notification);
    }

    public void deleteAll(){
        notificationRepository.deleteAll();
    }

    public void

}

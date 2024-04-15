package com.mytech.realtimeservice.services;

import com.mytech.realtimeservice.dto.ResponseMessage;
import com.mytech.realtimeservice.enums.NotificationType;
import com.mytech.realtimeservice.exception.myException.NotFoundException;
import com.mytech.realtimeservice.models.Notification;
import com.mytech.realtimeservice.models.users.User;
import com.mytech.realtimeservice.repositories.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Service
@Slf4j
public class NotificationService implements INotificationService {
    @Autowired
    private NotificationRepository notificationRepository;


    public Date getTimeForNotification(){
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DAY_OF_MONTH, -7); // Lấy ngày 7 ngày trước
        Date startDate = calendar.getTime();
        return startDate;
    }

    public List<Notification> getNotificationsByUserFromUserIdOrderByCreatedDateDesc(String userFrom) {
        Date startDate = getTimeForNotification();
        return notificationRepository.findByUserFromUserIdOrderByCreatedDateDesc(userFrom,startDate);
    }

    public List<Notification> getNotificationsByUserFromUserId(String userFrom) {
        Date startDate = getTimeForNotification();
        return notificationRepository.findForNotificationsByUserFromId(userFrom,startDate);
    }

    public List<Notification> getNotificationsByDelivory(String userFrom) {
        Date startDate = getTimeForNotification();
        return notificationRepository.findNotificationByDelivered(userFrom,startDate);
    }

    public Notification changeNotifStatusToRead(String notifID) {
        var notif = notificationRepository.findById(notifID)
                .orElseThrow(() -> new NotFoundException("not found!"));
        notif.setStatus(true);
        return notificationRepository.save(notif);
    }

    public void changeNotifiDelivory(String userFrom) {
        var notif = getNotificationsByDelivory(userFrom);
        notif.forEach(notification -> {
            notification.setDelivered(true);
            notificationRepository.save(notification);
        });
    }

    public void saveNotification(Notification notification) {
        notificationRepository.save(notification);
    }

    public void deleteAll(){
        notificationRepository.deleteAll();
    }

    public int CountNotificationsUnread(String userFrom){
       List<Notification> notifications = getNotificationsByDelivory(userFrom);
       return notifications.size();
    }

    public void sendNotification(User userFrom,User userTo,String notificationType,String message,String link){
        Notification notification = Notification.builder()
                .userFrom(userFrom)
                .userTo(userTo)
                .delivered(false)
                .status(false)
                .createdDate(LocalDateTime.now())
                .link(link)
                .build();
        saveNotification(notification);
        switch (notificationType){
            case "TAG":
                notification.setNotificationType(NotificationType.TAG);
                notificationRepository.save(notification);
                break;
            case "COMMENT":
                notification.setNotificationType(NotificationType.COMMENT);
                notificationRepository.save(notification);
                break;
            case "LIKE":
                notification.setNotificationType(NotificationType.LIKE);
                notificationRepository.save(notification);
                break;
            case "NORMAL":
                notification.setNotificationType(NotificationType.NORMAL);
                notification.setMessage(message);
                notificationRepository.save(notification);
                break;
            case "FRIEND":
                notification.setNotificationType(NotificationType.FRIEND);
                notificationRepository.save(notification);
                break;
        }
    }




}

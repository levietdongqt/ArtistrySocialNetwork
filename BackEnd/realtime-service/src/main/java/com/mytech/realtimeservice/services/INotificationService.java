package com.mytech.realtimeservice.services;

import com.mytech.realtimeservice.dto.NopeNotificationDTO;
import com.mytech.realtimeservice.models.NopeNotifications;
import com.mytech.realtimeservice.models.Notification;
import com.mytech.realtimeservice.models.users.User;

import java.util.List;

public interface INotificationService {
    public List<Notification> getNotificationsByUserFromUserIdOrderByCreatedDateDesc(String userFrom);
    public List<Notification> getNotificationsByUserFromUserId(String userFrom);

    public List<Notification> getNotificationsByDelivory(String userFrom);

    public void updateAllNotifications(List<String> listId);

    public Notification changeNotifStatusToRead(String notifID);

    public void changeNotifiDelivory(String userFrom);

    public void saveNotification(Notification notification);

    public void deleteAll();

    public int CountNotificationsUnread(String userFrom);

    public void sendNotification(User userFrom, User userTo, String notificationType, String message, String link);

    public void saveNopeNotification(NopeNotificationDTO nopeNotificationDTO);


}

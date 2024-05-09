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

    public void deleteNotification(String notifID);

    public void changeListNotifications(List<String> listId);

    public void changeNotifiDelivory(String userFrom);

    public void saveNotification(Notification notification);

    public int CountNotificationsUnread(String userFrom);

    public void sendNotification(User userFrom, User userTo, String notificationType, String message, String link);

    public void saveNopeNotification(NopeNotificationDTO nopeNotificationDTO);

    public boolean getNopeNotification(String userId,String nopeId);

    public void deleteNopeNotification(String userId,String nopeId);


}

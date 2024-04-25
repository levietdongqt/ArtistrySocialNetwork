package com.mytech.realtimeservice.services;

import com.mytech.realtimeservice.dto.NopeNotificationDTO;
import com.mytech.realtimeservice.dto.ResponseMessage;
import com.mytech.realtimeservice.enums.NotificationType;
import com.mytech.realtimeservice.exception.myException.NotFoundException;
import com.mytech.realtimeservice.models.NopeNotifications;
import com.mytech.realtimeservice.models.Notification;
import com.mytech.realtimeservice.models.users.User;
import com.mytech.realtimeservice.repositories.INopeNotificationsRepository;
import com.mytech.realtimeservice.repositories.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
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

    @Autowired
    private INopeNotificationsRepository nopeNotificationsRepository;

    @Autowired
    private WSSocket wsSocket;

    @Autowired
    private ModelMapper modelMapper;




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

    @Override
    public void updateAllNotifications(List<String> listId) {
        listId.stream().forEach(id -> {
            var notif = notificationRepository.findById(id);
            if(notif.isPresent()){
                notif.get().setStatus(true);
                notificationRepository.save(notif.get());
            }
        });
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
      return notificationRepository.countNotificationByDelivered(userFrom);
    }

    @Async
    public void sendNotification(User userFrom,User userTo,String notificationType,String message,String link){
        //Kiểm tra nope notification
        var checkAllNotification = handleNopeNotification(userFrom.getId(),userFrom.getId());
        if (checkAllNotification){
            return;
        }
        var checkNotification = handleNopeNotification(userFrom.getId(),userTo.getId());
        if (checkNotification){
            return;
        }
        //Kiểm tra xem có gửi cho chính mình không
        if(userFrom.getId().equals(userTo.getId())) {
            return;
        }
        Notification notification = Notification.builder()
                .userFrom(userFrom)
                .userTo(userTo)
                .delivered(false)
                .status(false)
                .createdDate(LocalDateTime.now())
                .link(link)
                .message(message)
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
            case "FOLLOWING":
                notification.setNotificationType(NotificationType.FOLLOWING);
                notificationRepository.save(notification);
                break;
            case "ACCEPT_FRIEND":
                notification.setNotificationType(NotificationType.ACCEPT_FRIEND);
                notificationRepository.save(notification);
                break;
        }
        wsSocket.sendPrivateNotification(userFrom.getId(),notification);
    }

    @Override
    public void saveNopeNotification(NopeNotificationDTO nopeNotificationDTO) {
        var nopeNotification = NopeNotifications
                .builder()
                .userId(nopeNotificationDTO.getUserId())
                .nopeId(nopeNotificationDTO.getNopeId())
                .nopeMinutesTime(nopeNotificationDTO.getNopeMinutesTime())
                .createdTime(LocalDateTime.now()).build();
        nopeNotificationsRepository.save(nopeNotification);
    }

    @Override
    public boolean getNopeNotification(String userId, String nopeId) {
        var check = handleNopeNotification(userId, nopeId);
        return check;
    }

    @Override
    public void deleteNopeNotification(String userId, String nopeId) {
        var nopeNotification = nopeNotificationsRepository.getNopeNotifications(userId, nopeId);
        if (nopeNotification.isPresent()){
            nopeNotificationsRepository.delete(nopeNotification.get());
            return;
        }
        throw new RuntimeException("Không tìm thấy nope notification");
    }

    public boolean handleNopeNotification(String userId,String userFrom){
        var nopeNotifications = nopeNotificationsRepository.getNopeNotifications(userId,userFrom);
        if (nopeNotifications.isPresent()){
            var nopeTime = nopeNotifications.get().getNopeMinutesTime();
            var timeCheckNope = nopeNotifications.get().getCreatedTime().plusMinutes(nopeTime);
            if (timeCheckNope.isAfter(LocalDateTime.now())){
                return true;
            }
            nopeNotificationsRepository.delete(nopeNotifications.get());
        }
        return false;
    }
    public Date getTimeForNotification(){
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DAY_OF_MONTH, -7); // Lấy ngày 7 ngày trước
        Date startDate = calendar.getTime();
        return startDate;
    }




}

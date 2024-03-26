package com.mytech.realtimeservice.services;

import com.mytech.realtimeservice.dto.ResponseMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void sendGlobalNotification(){
        ResponseMessage responseMessage = new ResponseMessage("Global Notification");
        System.out.println("sendGlobalNotification");
        messagingTemplate.convertAndSend("/topic/global-notification", responseMessage);
    }
    public void sendPrivateNotification(final String userId){

        System.out.println("sendPrivateNotification");
        ResponseMessage responseMessage = new ResponseMessage("Private Notification");
        messagingTemplate.convertAndSendToUser(userId,"/topic/private-notification", responseMessage);
    }
}

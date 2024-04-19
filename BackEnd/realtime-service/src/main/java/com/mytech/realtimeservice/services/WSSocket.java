package com.mytech.realtimeservice.services;

import com.mytech.realtimeservice.dto.ResponseMessage;
import com.mytech.realtimeservice.models.Notification;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WSSocket implements IWSSocket{

    @Autowired
    private SimpMessagingTemplate messagingTemplate;




    public void sendGlobalNotification(){
        ResponseMessage responseMessage = new ResponseMessage("Global Notification");
        messagingTemplate.convertAndSend("/topic/global-notification", responseMessage);
    }
    public void sendPrivateNotification(final String userId,Notification notification){
        System.out.println("sendPrivateNotification");
        messagingTemplate.convertAndSendToUser(userId,"/topic/private-notification", notification);
    }
}

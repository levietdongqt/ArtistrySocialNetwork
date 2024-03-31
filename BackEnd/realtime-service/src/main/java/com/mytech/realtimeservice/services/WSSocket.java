package com.mytech.realtimeservice.services;

import com.mytech.realtimeservice.dto.ResponseMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WSSocket {

    private SimpMessagingTemplate messagingTemplate;


    public void notifyFrontend(String message){
        ResponseMessage responseMessage = new ResponseMessage(message);
        sendGlobalNotification();
        messagingTemplate.convertAndSend("/topic/messages",responseMessage);
    }

    public void notifyUser(final String id,String message){
        ResponseMessage responseMessage = new ResponseMessage(message);
        sendPrivateNotification(id);
        messagingTemplate.convertAndSendToUser(id,"/topic/private-messages",responseMessage);
    }

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

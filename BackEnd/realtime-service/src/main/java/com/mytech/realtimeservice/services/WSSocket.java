package com.mytech.realtimeservice.services;

import com.mytech.realtimeservice.dto.ResponseMessage;
import com.mytech.realtimeservice.models.Comments;
import com.mytech.realtimeservice.repositories.CommentsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WSSocket implements IWSSocket{

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private CommentsRepository commentsRepository;

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

    public void sendGlobalComment(final String postId,Comments comments) {
        messagingTemplate.convertAndSend("/topic/comments/" + postId, comments);
    }

}

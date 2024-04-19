package com.mytech.realtimeservice.services;

import com.mytech.realtimeservice.dto.ResponseMessage;
import com.mytech.realtimeservice.models.Notification;
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



    public void sendGlobalNotification(){
        ResponseMessage responseMessage = new ResponseMessage("Global Notification");
        messagingTemplate.convertAndSend("/topic/global-notification", responseMessage);
    }
    public void sendPrivateNotification(final String userId,Notification notification){
        System.out.println("sendPrivateNotification");
        messagingTemplate.convertAndSendToUser(userId,"/topic/private-notification", notification);
    }

    public void sendGlobalComment(final String postId,Comments comments) {
        messagingTemplate.convertAndSend("/topic/comments/" + postId, comments);
    }

}

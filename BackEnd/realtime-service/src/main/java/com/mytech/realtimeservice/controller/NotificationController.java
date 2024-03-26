package com.mytech.realtimeservice.controller;

import com.mytech.realtimeservice.services.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

@Controller
public class NotificationController {

    @Autowired
    private NotificationService notificationService;


//    @MessageMapping("/message")
//    @SendTo("/topic/messages")
//    public ResponseMessage sendMessage1(String message) throws InterruptedException {
//        Thread.sleep(1000);
//        System.out.println(message);
//        notificationService.sendGlobalNotification();
//        return  new ResponseMessage().builder().content(message).build();
//    }

//    @MessageMapping("/private-message")
//    @SendToUser("/topic/private-messages")
//    public ResponseMessage sendPrivateMessage(String message, Principal principal) throws InterruptedException {
//        Thread.sleep(1000);
//        System.out.println(message);
//        notificationService.sendPrivateNotification(principal.getName());
//        return  new ResponseMessage().builder().content("Sending private message to user " + principal.getName()+ ":" +message).build();
//    }

}

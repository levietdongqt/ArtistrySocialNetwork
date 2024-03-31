package com.mytech.realtimeservice.controller;

import com.mytech.realtimeservice.dto.Message;
import com.mytech.realtimeservice.services.NotificationService;
import com.mytech.realtimeservice.services.WSSocket;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class WSController {

    @Autowired
    private WSSocket socket;

    @Autowired
    private NotificationService notificationService;

    @PostMapping("/send-message")
    public void sendMessage(@RequestBody Message message) {
        System.out.println(message.getMessageContent());
         socket.notifyFrontend(message.getMessageContent());
//        notificationService.sendGlobalNotification();
    }
    @PostMapping("/send-private-message/{id}")
    public void sendPrivateMessage(@PathVariable final String id, @RequestBody Message message) {
        System.out.println(message.getMessageContent());
        socket.notifyUser(id,message.getMessageContent());
//        notificationService.sendPrivateNotification(id);
    }

    public void getUsersId() {

    }

}

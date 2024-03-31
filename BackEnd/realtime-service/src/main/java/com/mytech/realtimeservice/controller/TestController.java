package com.mytech.realtimeservice.controller;

import com.mytech.realtimeservice.models.feignClient.User;
import com.mytech.realtimeservice.services.NotificationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;

@RestController
@RequestMapping("test")
@Slf4j
public class TestController {

    @Secured("ROLE_ADMIN")
    @GetMapping("/hello")
    public ResponseEntity<?> hello() {
        log.debug("Voo hello!!!!!!!!!!!!!!!!!!");
        HashMap<String, String> response = new HashMap<String, String>();
        response.put("hello", "HELLO FROM MAIN AUTH CONTROLLER");
        return ResponseEntity.ok().body(
                response
        );
    }

    @GetMapping("/hello2")
    public ResponseEntity<?> hello2() {
        log.debug("Voo hello!!!!!!!!!!!!!!!!!!");
        HashMap<String, String> response = new HashMap<String, String>();
        response.put("hello", "HELLO FROM MAIN AUTH CONTROLLER");
        return ResponseEntity.ok().body(response);
    }

//    @Autowired
//    private NotificationService notificationService;


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

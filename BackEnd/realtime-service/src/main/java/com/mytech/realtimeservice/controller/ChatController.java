package com.mytech.realtimeservice.controller;

import com.mytech.realtimeservice.dto.ConversationDTO;
import com.mytech.realtimeservice.dto.MessageDTO;
import com.mytech.realtimeservice.models.Message;
import com.mytech.realtimeservice.services.IChatService;
import com.mytech.realtimeservice.services.IConversationService;
import lombok.extern.slf4j.Slf4j;
import org.ehcache.Cache;
import org.ehcache.CacheManager;
import org.ehcache.config.builders.CacheManagerBuilder;
import org.ehcache.xml.XmlConfiguration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URL;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@Slf4j
public class ChatController {
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;
    @Autowired
    private IChatService chatService;
    @Autowired
    private IConversationService conversationService;

    @MessageMapping("/chat.sendPrivate")
//    @SendTo("/chat/message")
    public void handleSingleChat(@Payload MessageDTO message) {
        String destination = "/chat/message";
        log.info("FROM SEND MESSAGE" + message  );
        MessageDTO savedMessage = chatService.saveNewMessage(message);
        message.getReceiverIds().forEach(receiverId -> {
            simpMessagingTemplate.convertAndSendToUser(receiverId, destination, savedMessage);
        });
    }

    @MessageMapping("/chat.getConversation")
    public void getMessages(@Payload MessageDTO message) {
        String destination = "/chat/conversation";
        log.info("FROM getConversation" + message);
        List<MessageDTO> messages = chatService.getMessagesByConversation(message.getConversationId());
        simpMessagingTemplate.convertAndSendToUser(message.getSenderId(), destination, messages);
    }

    @MessageMapping("/chat.checkConversation")
//    @SendTo("/chat/message")
    public void checkConversation(@Payload ConversationDTO conversationDTO) {
        ConversationDTO savedConversation = conversationService.checkConversation(conversationDTO);
        simpMessagingTemplate.convertAndSend("/chat/message/", savedConversation);
    }

    @MessageMapping("/chat.sendGroup")
//    @SendTo("/chat/message")
    public MessageDTO handleGroupChat(@Payload MessageDTO chatMessage) {
        log.info("FROM SEND MESSAGE" + chatMessage);
        simpMessagingTemplate.convertAndSend("/chat/message", chatMessage);
        return chatMessage;
    }

    @MessageMapping("/chat.addUser")
    @SendTo("/chat/message")
    public Message addUser(@Payload Message chatMessage,
                           SimpMessageHeaderAccessor headerAccessor) {
        // Add username in web socket session
        headerAccessor.getSessionAttributes().put("username", "");
        return chatMessage;
    }
    //URL myUrl = getClass().getResource("/path/to/ehcache.xml"); // Replace with the path to your XML config file
    //        XmlConfiguration xmlConfig = new XmlConfiguration(myUrl);
//        CacheManager cacheManager = CacheManagerBuilder.newCacheManager(xmlConfig);
//        cacheManager.init();
//
//        Cache<String, String> myCache = cacheManager.getCache("myCache", String.class, String.class);
}

package com.mytech.realtimeservice.controller;

import com.mytech.realtimeservice.dto.ConversationDTO;
import com.mytech.realtimeservice.dto.ResponseObject;
import com.mytech.realtimeservice.models.Conversation;
import com.mytech.realtimeservice.services.IConversationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/conversation/")
@Slf4j
public class ConversationController {
    @Autowired
    private IConversationService conversationService;

    @PreAuthorize("hasRole('USER') && @jwtTokenHolder.isValidUserId(#userId)")
    @GetMapping("/by-user/{userId}")
    public ResponseEntity<?> getByUser(@PathVariable String userId) {
        log.info("getByUser" + userId);
        List<Conversation> conversations = conversationService.getConversationsByUserId(userId);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .data(conversations)
                        .status(HttpStatus.OK)
                        .message("Get conversation successfully").build()
        );
    }

    @PreAuthorize("hasRole('USER')")
    @PostMapping("/create")
    public ResponseEntity<?> createConversation(@RequestBody ConversationDTO conversation) {
        ConversationDTO conversationDTO = conversationService.createConversation(conversation);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .data(conversationDTO)
                        .status(HttpStatus.OK)
                        .message("Get conversation successfully").build()
        );
    }
}

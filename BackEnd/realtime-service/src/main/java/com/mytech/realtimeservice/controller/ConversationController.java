package com.mytech.realtimeservice.controller;

import com.mytech.realtimeservice.dto.ConversationDTO;
import com.mytech.realtimeservice.dto.ResponseObject;
import com.mytech.realtimeservice.dto.UserDTO;
import com.mytech.realtimeservice.helper.JwtTokenHolder;
import com.mytech.realtimeservice.models.Conversation;
import com.mytech.realtimeservice.models.users.User;
import com.mytech.realtimeservice.repositories.IConversationRepository;
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
    @Autowired
    private IConversationRepository conversationRepo;
    @Autowired
    private JwtTokenHolder jwtTokenHolder;

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/by-user")
    public ResponseEntity<?> getByUser() {
        log.info("getByUser");
        List<Conversation> conversations = conversationService.getByUserIdAndIgnoreTypeHide(jwtTokenHolder.getUserId());
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .data(conversations)
                        .status(HttpStatus.OK)
                        .message("Get conversation successfully").build()
        );
    }


    @PreAuthorize("hasRole('USER')")
    @PostMapping("/create-group")
    public ResponseEntity<?> createGroup(@RequestBody ConversationDTO conversation) {
        conversationService.checkValidRequest(conversation);
        ConversationDTO conversationDTO = conversationService.createConversation(conversation);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .data(conversationDTO)
                        .status(HttpStatus.OK)
                        .message("Get conversation successfully").build()
        );
    }

    @PreAuthorize("hasRole('USER')")
    @PostMapping("/check")
    public ResponseEntity<?> createConversation(@RequestBody ConversationDTO conversation) {
        ConversationDTO conversationDTO = conversationService.checkConversation(conversation);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .data(conversationDTO)
                        .status(HttpStatus.OK)
                        .message("Get conversation successfully").build()
        );
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/search")
    public ResponseEntity<?> search(@RequestParam("search") String name) {
        List<Conversation> conversations = conversationRepo.findByMemberIdAndOtherMembersNicknameContains(jwtTokenHolder.getUserId(), name);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .data(conversations)
                        .status(HttpStatus.OK)
                        .message("Get conversation successfully").build()
        );
    }

    @PreAuthorize("hasRole('USER')")
    @PostMapping("/un-read")
    public ResponseEntity<?> findUnRead() {
        List<Conversation> conversations = conversationService.findUnReads(jwtTokenHolder.getUserId());
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .data(conversations)
                        .status(HttpStatus.OK)
                        .message("Get conversation successfully").build()
        );
    }

    @PreAuthorize("hasRole('USER')")
    @PostMapping("/update")
    public ResponseEntity<?> updateConversation(@RequestBody ConversationDTO conversationDTO) {
        conversationService.checkValidRequest(conversationDTO);
        conversationService.update(conversationDTO);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .data(null)
                        .status(HttpStatus.OK)
                        .message("Update conversation successfully").build()
        );
    }

    @PreAuthorize("hasRole('USER')")
    @PostMapping("/delete")
    public ResponseEntity<?> delete(@RequestBody ConversationDTO conversationDTO) {
        conversationService.checkValidRequest(conversationDTO);
        conversationService.deleteConversation(conversationDTO);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .data(null)
                        .status(HttpStatus.OK)
                        .message("Delete conversation successfully").build()
        );
    }
    @PreAuthorize("hasRole('USER')")
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        Conversation conversation = conversationService.getConversationById(id);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .data(conversation)
                        .status(HttpStatus.OK)
                        .message("Get conversation successfully").build()
        );
    }

    @PreAuthorize("hasRole('USER')")
    @PostMapping("/out-group/{conversationId}")
    public ResponseEntity<?> outConversation(@PathVariable String conversationId) {
        conversationService.outConversation(jwtTokenHolder.getUserId(),conversationId);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .data(null)
                        .status(HttpStatus.OK)
                        .message("out conversation successfully").build()
        );
    }
}

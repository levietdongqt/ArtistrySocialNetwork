package com.mytech.realtimeservice.services;

import com.mytech.realtimeservice.dto.ConversationDTO;
import com.mytech.realtimeservice.dto.MessageDTO;
import org.springframework.scheduling.annotation.Async;

import java.util.List;

public interface IChatService {
    List<MessageDTO> getMessagesByConversation(String conversationId);

    MessageDTO saveNewMessage(MessageDTO message);

    void updateConversation(ConversationDTO conversation);

    ConversationDTO seenFlag(ConversationDTO conversationDTO);
}

package com.mytech.realtimeservice.services;

import com.mytech.realtimeservice.dto.ConversationDTO;
import com.mytech.realtimeservice.models.Conversation;

import java.util.List;

public interface IConversationService {
    Conversation getConversationById(String id);
    ConversationDTO createConversation(ConversationDTO conversationDTO);
    void updateConversation(Conversation conversation);
    void deleteConversation(String id);

    List<Conversation> getConversationsByUserId(String userId);

    ConversationDTO checkConversation(ConversationDTO conversationDTO);

    List<Conversation> searchConversationsByMemberName(String userId,String searchName);
}

package com.mytech.realtimeservice.services;

import com.mytech.realtimeservice.dto.ConversationDTO;
import com.mytech.realtimeservice.models.Conversation;

import java.util.List;

public interface IConversationService {
    Conversation getConversationById(String id);
    ConversationDTO createConversation(ConversationDTO conversationDTO);
    void deleteConversation(ConversationDTO conversationDTO);

    List<Conversation> getByUserIdAndIgnoreTypeHide(String userId);

    ConversationDTO checkConversation(ConversationDTO conversationDTO);

    List<Conversation> searchConversationsByMemberName(String userId,String searchName);

    List<Conversation> findUnReads(String userId);

    void update(ConversationDTO conversationDTO);

    void checkValidRequest(ConversationDTO conversationDTO);
}

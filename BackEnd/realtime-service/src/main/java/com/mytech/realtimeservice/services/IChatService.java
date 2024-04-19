package com.mytech.realtimeservice.services;

import com.mytech.realtimeservice.dto.MessageDTO;

import java.util.List;

public interface IChatService {
    List<MessageDTO> getMessagesByConversation(String conversationId);

    MessageDTO saveNewMessage(MessageDTO message);
}

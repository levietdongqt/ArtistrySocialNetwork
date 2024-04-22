package com.mytech.realtimeservice.services;

import com.mytech.realtimeservice.dto.MessageDTO;

import java.util.List;
import java.util.Set;

public interface IMessageService {
    public List<MessageDTO> getMessagesByConversationId(String conversationId);
    public void saveMessage(MessageDTO messageDTO);
    public MessageDTO findMessageById(String id);
    public void deleteMessageById(String id);
    public Set<MessageDTO> findAllMessages();
    public Set<MessageDTO> findMessagesByUserId(String userId);
}

package com.mytech.realtimeservice.services.implement;

import com.mytech.realtimeservice.dto.MessageDTO;
import com.mytech.realtimeservice.models.Message;
import com.mytech.realtimeservice.repositories.IMessageRepository;
import com.mytech.realtimeservice.services.IMessageService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public class MessageService implements IMessageService {

    @Autowired
    private IMessageRepository messageRepos;
    @Autowired
    private ModelMapper mapper;

    @Override
    public List<MessageDTO> getMessagesByConversationId(String conversationId) {
        List<Message> messages = messageRepos.findAllByConversationId(conversationId);
        return messages.stream().map(message -> mapper.map(message, MessageDTO.class)).toList();
    }
    @Override
    public void saveMessage(MessageDTO messageDTO) {

    }

    @Override
    public MessageDTO findMessageById(String id) {
        return null;
    }

    @Override
    public void deleteMessageById(String id) {

    }

    @Override
    public Set<MessageDTO> findAllMessages() {
        return null;
    }

    @Override
    public Set<MessageDTO> findMessagesByUserId(String userId) {
        return null;
    }
}

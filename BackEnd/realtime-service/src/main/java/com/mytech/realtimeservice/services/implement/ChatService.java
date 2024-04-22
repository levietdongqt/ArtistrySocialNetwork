package com.mytech.realtimeservice.services.implement;

import com.mytech.realtimeservice.dto.ConversationDTO;
import com.mytech.realtimeservice.dto.MessageDTO;
import com.mytech.realtimeservice.models.Conversation;
import com.mytech.realtimeservice.models.Message;
import com.mytech.realtimeservice.repositories.IConversationRepository;
import com.mytech.realtimeservice.repositories.IMessageRepository;
import com.mytech.realtimeservice.services.IChatService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ChatService implements IChatService {
    @Autowired
    private IMessageRepository messageRepo;
    @Autowired
    private IConversationRepository conversationRepo;
    @Autowired
    private ModelMapper mapper;

    @Override
    public List<MessageDTO> getMessagesByConversation(String conversationId) {
        List<Message> messages = messageRepo.findAllByConversationId(conversationId);
        return messages.stream().map(message -> mapper.map(message, MessageDTO.class)).toList();
    }

    @Override
    public MessageDTO saveNewMessage(MessageDTO message) {
        Message newMessage = mapper.map(message, Message.class);
        newMessage.setSendTime(LocalDateTime.now());
        Message savedMessage = messageRepo.save(newMessage);
        return mapper.map(savedMessage, MessageDTO.class);
    }

    @Override
    @Async
    public void updateConversation(ConversationDTO conversationDto) {
        Conversation conversation = mapper.map(conversationDto, Conversation.class);
        conversationRepo.save(conversation);
    }
}

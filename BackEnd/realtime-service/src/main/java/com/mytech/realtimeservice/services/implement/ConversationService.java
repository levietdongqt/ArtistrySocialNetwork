package com.mytech.realtimeservice.services.implement;

import com.mytech.realtimeservice.dto.ConversationDTO;
import com.mytech.realtimeservice.dto.UserDTO;
import com.mytech.realtimeservice.enums.ConversationType;
import com.mytech.realtimeservice.models.Conversation;
import com.mytech.realtimeservice.repositories.IConversationRepository;
import com.mytech.realtimeservice.services.IConversationService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConversationService implements IConversationService {
    @Autowired
    private IConversationRepository conversationRepo;
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public Conversation getConversationById(String id) {
        return null;
    }

    @Override
    public ConversationDTO createConversation(ConversationDTO conversationDTO) {
        Conversation conversation = modelMapper.map(conversationDTO, Conversation.class);
        conversationRepo.save(conversation);
        return modelMapper.map(conversation, ConversationDTO.class);
    }

    @Override
    public void updateConversation(Conversation conversation) {

    }

    @Override
    public void deleteConversation(String id) {

    }

    @Override
    public List<Conversation> getConversationsByUserId(String userId) {
        return conversationRepo.getConversationsByUserId(userId);
    }

    @Override
    public ConversationDTO checkConversation(ConversationDTO conversationDTO) {
        List<String> userIds = conversationDTO.getMembers().stream().map(UserDTO::getId).toList();
        Conversation conversation = modelMapper.map(conversationDTO, Conversation.class);
        List<Conversation> conversations = conversationRepo.findConversationsByMemberIdsAAndType(userIds, ConversationType.PRIVATE);
        if (conversations.isEmpty()) {
            return modelMapper.map(conversationRepo.save(conversation), ConversationDTO.class);
        }
        if (isPrivateConversation(conversations)) {
            return modelMapper.map(conversations.get(0), ConversationDTO.class);
        }
        return null;
    }

    private boolean isPrivateConversation(List<Conversation> conversations) {
        return conversations.size() == 1 && conversations.get(0).getMembers().size() == 2;
    }
}

package com.mytech.realtimeservice.services.implement;

import com.mytech.realtimeservice.dto.ConversationDTO;
import com.mytech.realtimeservice.dto.UserDTO;
import com.mytech.realtimeservice.enums.ConversationType;
import com.mytech.realtimeservice.exception.myException.ForbiddenException;
import com.mytech.realtimeservice.exception.myException.InvalidPropertyException;
import com.mytech.realtimeservice.exception.myException.NotFoundException;
import com.mytech.realtimeservice.helper.JwtTokenHolder;
import com.mytech.realtimeservice.models.Conversation;
import com.mytech.realtimeservice.repositories.IConversationRepository;
import com.mytech.realtimeservice.repositories.MyRepository;
import com.mytech.realtimeservice.services.IConversationService;
import com.mytech.realtimeservice.services.IMessageService;
import com.mytech.realtimeservice.services.INotificationService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class ConversationService implements IConversationService {
    @Autowired
    private JwtTokenHolder jwtTokenHolder;
    @Autowired
    private IConversationRepository conversationRepo;
    @Autowired
    private IMessageService messageService;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private MyRepository myRepository;
    @Autowired
    private INotificationService notificationService;

    @Override
    public Conversation getConversationById(String id) {
        return conversationRepo.findById(id).orElseThrow(() -> new NotFoundException("Could not find conversation"));
    }

    @Override
    public ConversationDTO createConversation(ConversationDTO conversationDTO) {
        Conversation conversation = modelMapper.map(conversationDTO, Conversation.class);
        conversation.setCreateAt(LocalDateTime.now());
        conversation.setUpdatedAt(LocalDateTime.now());
        conversationRepo.save(conversation);
        String ownerId =  jwtTokenHolder.getUserId();
        var usersInGroup = conversation.getMembers().stream().filter(user -> !user.getId().equals(ownerId)).collect(Collectors.toList());
        var owner = conversation.getMembers().stream().filter(user -> user.getId().equals(ownerId)).findFirst().get();
        usersInGroup.forEach(user ->{
            notificationService.sendNotification(user,owner,"GROUP","đã tạo phòng chat","");
        });
        return modelMapper.map(conversation, ConversationDTO.class);
    }


    @Override
    public void deleteConversation(ConversationDTO conversationDTO) {
        if (conversationDTO.getType().equals(ConversationType.PRIVATE)) {
            conversationDTO.setType(ConversationType.HIDE);
            conversationDTO.setLastMessage(null);
            myRepository.updateConversation(conversationDTO);
        } else {
            conversationRepo.deleteById(conversationDTO.getId());
        }
//        conversationRepo.deleteById(id);
        messageService.deleteMessageByConversationId(conversationDTO.getId());
    }

    @Override
    public List<ConversationDTO> getByUserIdAndIgnoreTypeHide(String userId) {
        return conversationRepo.getByUserIdAndIgnoreTypeHide(userId).stream()
                .map(item -> modelMapper.map(item,ConversationDTO.class)).toList();
    }

    @Override
    public ConversationDTO checkConversation(ConversationDTO conversationDTO) {
        List<String> userIds = conversationDTO.getMembers().stream().map(UserDTO::getId).toList();
        Conversation conversation = modelMapper.map(conversationDTO, Conversation.class);
        List<Conversation> conversations = conversationRepo.findConversationsByMemberIdsAAndType(userIds, ConversationType.PRIVATE);
        if (conversations.isEmpty()) {
            conversation.setCreateAt(LocalDateTime.now());
            conversation.setUpdatedAt(LocalDateTime.now());
            return modelMapper.map(conversationRepo.save(conversation), ConversationDTO.class);
        }
        if (isPrivateConversation(conversations)) {
            return modelMapper.map(conversations.get(0), ConversationDTO.class);
        }
        return null;
    }

    @Override
    public List<Conversation> searchConversationsByMemberName(String userId, String searchName) {
        return null;
    }

    @Override
    public List<Conversation> findUnReads(String userId) {
        return conversationRepo.findUnReads(userId);
    }


    @Override
    public void update(ConversationDTO conversationDTO) {
        myRepository.updateConversation(conversationDTO);
    }

    @Override
    public void checkValidRequest(ConversationDTO conversationDTO) {
        boolean isValid = conversationDTO.getMembers().stream()
                .anyMatch(userDTO -> userDTO.getId().equals(jwtTokenHolder.getUserId()));
        if (!isValid) {
            throw new ForbiddenException("You are not allowed to access this conversation");
        }
    }

    @Override
    public void outConversation(String userId, String conversationId) {
        Conversation conversation = conversationRepo.findById(conversationId)
                .orElseThrow(() -> new NotFoundException("Conversation not found: " + conversationId));
        conversation.getMembers().forEach(user -> {
            if(user.getId().equals(userId)){
                user.setIsExited(true);
            }
        });
        conversationRepo.save(conversation);
    }

    private boolean isPrivateConversation(List<Conversation> conversations) {
        return conversations.size() == 1 && conversations.get(0).getMembers().size() == 2;
    }
}

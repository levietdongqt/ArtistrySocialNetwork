package com.mytech.mainservice.service.implement;

import com.mytech.mainservice.client.NotificationForeignClient;
import com.mytech.mainservice.dto.NotificationDTO;
import com.mytech.mainservice.dto.UserDTO;
import com.mytech.mainservice.dto.foreignClient.ConversationDTO;
import com.mytech.mainservice.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

public class AsyncService {
//    @Autowired
//    private NotificationForeignClient foreignClient;
//    @Async
//    protected void sendNotificationAfterAddFriendship(String userId, String friendId, String type, String message) {
//        UserDTO user = userService.getUserById(userId);
//        UserDTO friend = userService.getUserById(friendId);
//        NotificationDTO notificationDTO = NotificationDTO.builder()
//                .userFrom(friend)
//                .userTo(user)
//                .notificationType(type)
//                .message(message)
//                .link(user.getId())
//                .build();
//        notificationForeignClient.saveNotification(notificationDTO);
//    }

//    @Async
//    public void createConversation(User friend, User user) {
//        HashMap<String, Object> member1 = new HashMap<String, Object>();
//        member1.put("id", friend.getId());
//        member1.put("fullName", friend.getFullName());
//        member1.put("avatar", friend.getAvatar());
//        member1.put("nickName", friend.getFullName());
//        member1.put("notSeen", false);
//
//        HashMap<String, Object> member2 = new HashMap<>();
//        member2.put("id", user.getId());
//        member2.put("fullName", user.getFullName());
//        member2.put("avatar", user.getAvatar());
//        member1.put("nickName", user.getFullName());
//        member1.put("notSeen", false);
//
//        ConversationDTO conversationDTO = ConversationDTO.builder()
//                .members(List.of(member1, member2))
//                .createAt(LocalDateTime.now())
//                .updatedAt(LocalDateTime.now())
//                .type("PRIVATE")
//                .build();
//        foreignClient.createConversation(conversationDTO);
//    }
}

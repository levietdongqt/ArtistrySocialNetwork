package com.mytech.realtimeservice.models;

import com.mytech.realtimeservice.enums.ConversationType;
import com.mytech.realtimeservice.models.users.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Data
@Document(collection = "conversation")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Conversation {
    @Id
    private String id;
    private List<User> members;
    private Message lastMessage;
    private LocalDateTime updatedAt;
    private LocalDateTime createAt;
    private ConversationType type;
}

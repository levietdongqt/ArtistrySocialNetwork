package com.mytech.realtimeservice.models;

import com.mytech.realtimeservice.models.messages.LastMessage;
import com.mytech.realtimeservice.models.users.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;
@Data
@Document
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Conversation {
    @Id
    private String id;
    private List<User> members;

    private LastMessage lastMessage;

    private LocalDateTime updatedAt;
    private LocalDateTime createAt;
}

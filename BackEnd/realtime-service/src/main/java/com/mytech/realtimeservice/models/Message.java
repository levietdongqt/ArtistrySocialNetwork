package com.mytech.realtimeservice.models;

import com.mytech.realtimeservice.enums.MessageType;
import com.mytech.realtimeservice.models.messages.LikeMessage;
import com.mytech.realtimeservice.models.messages.ParentMessage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import java.time.LocalDateTime;

@Data
@Document
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Message {
    @Id
    private String id;
    private String conversationId;
    private String senderId;
    private String receiverId;
    private String content;
    private MessageType type;
    private ParentMessage parentMessage;
    private LikeMessage likeMessage;
    private LocalDateTime sendTime;
    private boolean seen;


}

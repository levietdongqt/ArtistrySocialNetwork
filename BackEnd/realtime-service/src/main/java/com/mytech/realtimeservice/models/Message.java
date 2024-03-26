package com.mytech.realtimeservice.models;

import com.mytech.realtimeservice.models.enums.MessageType;
import com.mytech.realtimeservice.models.messages.LikeMessage;
import com.mytech.realtimeservice.models.messages.ParentMessage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

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

    private String senderUserId;

    private String receiverUserId;

    private String content;

    private MessageType type;

    private ParentMessage parentMessage;

    private LikeMessage likeMessage;

    private LocalDateTime sentTime;

}

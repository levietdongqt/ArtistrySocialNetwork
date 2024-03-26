package com.mytech.realtimeservice.models.messages;

import com.mytech.realtimeservice.models.enums.MessageType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LastMessage {
    private String content;
    private String senderId;
    private String senderName;
    private LocalDateTime sentTime;

    private MessageType type;


}

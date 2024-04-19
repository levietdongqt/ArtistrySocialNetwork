package com.mytech.realtimeservice.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.mytech.realtimeservice.enums.MessageType;
import com.mytech.realtimeservice.models.messages.ParentMessage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class MessageDTO {
    private String id;
    private String conversationId;
    private String senderId;
    private List<String> receiverIds;
    private String content;
    private MessageType type;
    private ParentMessage parentMessage;
    private Integer likes;
    private LocalDateTime sendTime;
    private boolean seen;
    private boolean isTyping;
}
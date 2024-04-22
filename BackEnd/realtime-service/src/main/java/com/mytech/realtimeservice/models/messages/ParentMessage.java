package com.mytech.realtimeservice.models.messages;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ParentMessage {
    private String content;
    private String senderId;
    private String messageId;
}

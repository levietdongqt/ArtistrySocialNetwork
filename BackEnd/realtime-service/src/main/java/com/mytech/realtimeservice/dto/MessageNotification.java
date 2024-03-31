package com.mytech.realtimeservice.dto;

import lombok.Data;

@Data
public class MessageNotification {
    private String message;
    private String userId;

    private String type;
}

package com.mytech.realtimeservice.dto;

import com.mytech.realtimeservice.models.users.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NotificationDTO {
    private User userFrom;
    private User userTo;
    private String notificationType;
    private String message;
    private String link;
}

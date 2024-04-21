package com.mytech.mainservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NotificationDTO {
    private UserDTO userFrom;
    private UserDTO userTo;
    private String notificationType;
    private String message;
    private String link;
}

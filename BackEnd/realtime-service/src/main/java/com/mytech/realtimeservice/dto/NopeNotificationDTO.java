package com.mytech.realtimeservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NopeNotificationDTO {
    private String userId;
    private String nopeId;
    private LocalDateTime createdTime;
    private int nopeMinutesTime;
}

package com.mytech.realtimeservice.models;

import com.mytech.realtimeservice.enums.NotificationType;
import com.mytech.realtimeservice.models.users.User;
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
public class Notification {
    @Id
    private String id;
    private User userTo;

    private User userFrom;

    private LocalDateTime createdDate;

    private boolean status;

    private boolean delivered;

    private String message;

    private String link;

    private NotificationType notificationType;

}

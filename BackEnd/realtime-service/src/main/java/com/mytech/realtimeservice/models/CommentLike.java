package com.mytech.realtimeservice.models;

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
public class CommentLike {
    @Id
    private String id;
    private String commentId;
    private String postId;

    private User byUser;

    private String icon;

    private LocalDateTime createdAt;

}

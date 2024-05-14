package com.mytech.realtimeservice.models;

import com.mytech.realtimeservice.models.users.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Document
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Comments {
    @Id
    private String id;
    private String content;
    private LocalDateTime sentDate;
    private LocalDateTime updatedDate;
    private List<MediaObject> mediaUrl;
    private String postId;
    private String parentCommentId;
    private User byUser;
    private List<User> commentsLikes = new ArrayList<>();
    private List<User> tagUserComments = new ArrayList<>();
    private int totalLikes;
    private int totalReply;
}

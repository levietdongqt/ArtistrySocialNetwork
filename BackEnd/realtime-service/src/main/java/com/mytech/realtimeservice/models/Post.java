package com.mytech.realtimeservice.models;
import com.mytech.realtimeservice.models.users.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Document
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Post implements Serializable {
    @Id
    private String id;
    private User user;
    private String content;
    private LocalDateTime createdAt;
    private String createdBy;
    private LocalDateTime updatedAt;
    private List<MediaObject> mediaUrl;
    private boolean status;
    private List<User> tagUserPosts;
    private double priorityScore;
    private List<User> userPostLikes = new ArrayList<>();
    private int userReplies;
    private int totalLikes;
    private int totalComments;
    private int totalShares;
    private LocalDateTime lastInteractionAt;
    private boolean leastPrioritized;

    @Transient
    private double engagementScore;
}

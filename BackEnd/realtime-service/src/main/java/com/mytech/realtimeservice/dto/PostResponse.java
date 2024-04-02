package com.mytech.realtimeservice.dto;

import com.mytech.realtimeservice.models.users.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PostResponse {

    private String id;
    private User user;
    private String content;
    private List<String> mediaUrl;
    private UserParent parent;
    private String createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean status;
    private List<User> tagUserPosts;
    private double priorityScore;
    private List<User> userPostLikes;
    private int userReplies;
    private int totalLikes;
    private int totalComments;
}

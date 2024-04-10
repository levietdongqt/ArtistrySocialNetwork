package com.mytech.realtimeservice.dto;


import com.mytech.realtimeservice.models.users.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CommentResponse {
    private String id;
    private String content;
    private LocalDateTime sentDate;
    private LocalDateTime updatedDate;
    private List<String> mediaUrl;
    private String postId;
    private String commentId;
    private User byUser;
    private List<User> commentsLikes = new ArrayList<>();
    private List<User> tagUserComments = new ArrayList<>();
    private int totalLikes;
    private int totalReply;
}

package com.mytech.realtimeservice.models;
import com.mytech.realtimeservice.models.users.User;
import com.mytech.realtimeservice.models.users.UserTemplate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Document
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Post {
    @Id
    private String id;

    private User userPost;
    private String content;
    private LocalDateTime createdAt;
    private String createdBy;
    private LocalDateTime updatedAt;
    private List<String> mediaUrl;

    private boolean status;

    private List<UserTemplate> tagUserPosts;

    private double priorityScore;

    private List<UserTemplate> userPostLikes;

    private int userReplies;

    @DBRef
    private List<PostLike> postLikes;

}

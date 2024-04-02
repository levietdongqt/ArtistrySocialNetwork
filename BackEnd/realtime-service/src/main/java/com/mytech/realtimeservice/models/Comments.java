package com.mytech.realtimeservice.models;

import com.mytech.realtimeservice.models.comments.CommentLike;
import com.mytech.realtimeservice.models.users.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
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
    private String postId;
    private User byUser;
    private List<CommentLike> commentLikes;
    private List<String> reply;

}

package com.mytech.realtimeservice.dto;

import com.mytech.realtimeservice.models.MediaObject;
import com.mytech.realtimeservice.models.users.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CommentDTO {
    private String postId;
    private String commentsParentId;
    private String content;
    private User byUser;
    private User usersComments;
    private List<MediaObject> mediaUrl;
    private List<User> userTags = new ArrayList<>();
}

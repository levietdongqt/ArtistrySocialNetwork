package com.mytech.mainservice.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PostDTO implements Serializable {
    private String id;
    //private UserDTO user;
    private String content;
    private LocalDateTime createdAt;
    private String createdBy;
    private LocalDateTime updatedAt;
    private List<String> mediaUrl;
    private boolean status;
//    private List<UserDTO> tagUserPosts;
    private double priorityScore;
//    private List<UserDTO> userPostLikes;
    private int userReplies;
    private int totalLikes;
    private int totalComments;
    private final String type = "post";
}

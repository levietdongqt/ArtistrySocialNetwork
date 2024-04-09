package com.mytech.realtimeservice.converter;

import com.mytech.realtimeservice.models.Post;
import com.mytech.realtimeservice.models.elasticsearch.PostELS;
import com.mytech.realtimeservice.models.users.User;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class ConverterObject {

    public static PostELS convertPostToPostELS(Post post){
        return PostELS.builder()
                .id(post.getId())
                .content(post.getContent())
                .createdAt(post.getCreatedAt())
                .createdBy(post.getCreatedBy())
                .updatedAt(post.getUpdatedAt())
                .mediaUrl(post.getMediaUrl())
                .status(post.isStatus())
                .tagUserPosts(post.getUserPostLikes())
                .userPostLikes(post.getUserPostLikes())
                .userReplies(post.getUserReplies())
                .totalLikes(post.getTotalLikes())
                .totalComments(post.getTotalComments())
                .build();
    }
}


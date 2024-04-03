package com.mytech.realtimeservice.dto;

import com.mytech.realtimeservice.models.users.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PostLikeDTO {
    private String postId;

    private User byUser;

    private String icon;
}

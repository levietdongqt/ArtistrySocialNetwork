package com.mytech.realtimeservice.models.comments;

import com.mytech.realtimeservice.models.users.UserTemplate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CommentLike {
    private String icon;
    private UserTemplate user;

}

package com.mytech.realtimeservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PostDTO {
    private String content;
    private List<String> mediaUrl;
    private String sendUserId;
    private String sendUserName;
    private String sendUserAvatarUrl;
    private List<UserDTO> userTags;
}

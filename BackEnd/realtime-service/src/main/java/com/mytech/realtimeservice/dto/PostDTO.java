package com.mytech.realtimeservice.dto;

import com.mytech.realtimeservice.models.MediaObject;
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
    private List<MediaObject> mediaUrl;
    private String sendUserId;
    private String sendFullName;
    private String sendUserAvatarUrl;
    private String sendUserCoverImage;
    private String sendUserBio;
    private Boolean sendVerified = false;
    private List<UserDTO> userTags;

}

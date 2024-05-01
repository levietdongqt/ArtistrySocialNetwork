package com.mytech.realtimeservice.models.users;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class User{
    private String id;
    private String fullName;
    private String nickname;
    private String avatar;
    private String coverImage;
    private String bio;
    private Boolean notSeen;
    private Boolean isGroupOwner;
    private boolean verified;
}








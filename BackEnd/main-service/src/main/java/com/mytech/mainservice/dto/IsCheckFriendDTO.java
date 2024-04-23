package com.mytech.mainservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class IsCheckFriendDTO {
    private boolean isFollow;
    private boolean isFriend;
    private boolean isPending;
    private boolean isAcceptFriend;
}

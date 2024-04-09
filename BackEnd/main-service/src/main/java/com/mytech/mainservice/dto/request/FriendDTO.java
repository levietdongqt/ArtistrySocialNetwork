package com.mytech.mainservice.dto.request;

import lombok.Value;

public record FriendDTO(
        String userId,
        String friendId
) {
}

package com.mytech.realtimeservice.models.messages;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LikeMessage {
    private int likeAmount;
    private List<String> userIds;
}

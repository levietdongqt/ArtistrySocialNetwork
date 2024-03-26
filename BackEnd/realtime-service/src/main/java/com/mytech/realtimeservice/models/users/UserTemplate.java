package com.mytech.realtimeservice.models.users;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserTemplate {
    private String userId;
    private String userName;
}

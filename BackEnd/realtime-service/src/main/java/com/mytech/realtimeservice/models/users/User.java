package com.mytech.realtimeservice.models.users;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User{
    private String id;
    private String fullName;
    private String avatar;
    private String coverImage;
    private String bio;
    private boolean verified;
}








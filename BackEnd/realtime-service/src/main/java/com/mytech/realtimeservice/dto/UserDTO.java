package com.mytech.realtimeservice.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class UserDTO {
    private String id;
    private String fullName;
    private String nickname;
    private String email;
    private String phoneNumber;
    private boolean verified = false;
    private boolean gender;
    private LocalDate dateOfBirth;
    private String avatar;
    private String coverImage;
    private String bio;
    private Boolean notSeen;

    //Đánh dấu là user sẽ được Tag vào bài viết
    private boolean tag;
}

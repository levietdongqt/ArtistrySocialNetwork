package com.mytech.realtimeservice.models.feignClient;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.mytech.realtimeservice.enums.UserStatus;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class User implements Serializable {
    private String id = UUID.randomUUID().toString();

    private String fullName;

    private String email;

    private String phoneNumber;

    private boolean gender = true;

    private LocalDate dateOfBirth;

    private boolean emailConfirmed = false;

    private boolean phoneConfirmed = false;

    private LocalDateTime createDate;

    private UserStatus status;

    private Map<String, Object> location;

    private String avatar;

    private String coverImage;

    private String authProvider;

    private Map<String, Object> userDetails;

    private float priorityScore;

    private String password;
    private boolean changePassword = false;

    private List<String> searchHistory;

    private String bio;

    private LocalDateTime updateAt;

    private boolean verified = false;

    private int totalPost;

    private int totalPhotos;

    private String pinnedPost;

    private  List<Role> roles;

}
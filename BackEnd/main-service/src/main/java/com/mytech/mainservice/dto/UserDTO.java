package com.mytech.mainservice.dto;

import co.elastic.clients.util.DateTime;
import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.mytech.mainservice.enums.AccentType;
import com.mytech.mainservice.enums.Theme;
import com.mytech.mainservice.enums.UserStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Queue;

/**
 * DTO for {@link com.mytech.mainservice.model.User}
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserDTO implements Serializable {
    private String id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String address;
    private boolean gender;
    private LocalDate dateOfBirth;
    private UserStatus status;
    private String avatar;
    private String coverImage;
    private Map<String, Object> userDetails;
    private Map<String, Object> location;
    private String password;
    private List<String> roles;
    private AccentType accent;
    private Theme theme;
    private String bio;
    private boolean verified;
    private LocalDateTime createDate ;
    private LocalDateTime updateAt;
    private String authProvider;


    @JsonProperty("password")
    public String getPasswordForJson() {
        return null;
    }
}
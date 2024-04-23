package com.mytech.mainservice.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.mytech.mainservice.enums.FriendShipStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FriendDTO {
    private UserDTO user;
    private IsCheckFriendDTO isCheckFriend;
    private String type = "user";
}

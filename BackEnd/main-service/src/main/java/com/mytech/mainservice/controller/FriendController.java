package com.mytech.mainservice.controller;

import com.mytech.mainservice.dto.ResponseObject;
import com.mytech.mainservice.dto.UserDTO;
import com.mytech.mainservice.dto.request.FriendDTO;
import com.mytech.mainservice.model.Friendship;
import com.mytech.mainservice.service.IFriendService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/friends")
public class FriendController {
    @Autowired
    private IFriendService friendService;

    @PostMapping
    public String addFriend(String friend) {
        return friend;
    }

//    @Secured({"ROLE_ADMIN", "ROLE_USER"})
    @GetMapping("/{userId}")
    public ResponseEntity<ResponseObject> getFriends(@PathVariable String userId) {
        Set<UserDTO> friends = friendService.getFriends(userId);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Get Friends successfully")
                        .data(friends)
                        .build()
        );
    }

    @Secured({"ROLE_ADMIN", "ROLE_USER"})
    @PostMapping("/acceptFriend")
    public ResponseEntity<ResponseObject> acceptFriend(@RequestBody FriendDTO friendDTO) {
        friendService.acceptFriendRequest(friendDTO.getUserId(), friendDTO.getFriendId());
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Accept Friends successfully")
                        .data(null)
                        .build()
        );
    }

    @Secured({"ROLE_ADMIN", "ROLE_USER"})
    @PostMapping("/addFriend")
    public ResponseEntity<ResponseObject> addFriend(@RequestBody FriendDTO friendDTO) {
        friendService.addFriend(friendDTO.getUserId(), friendDTO.getFriendId());
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Add Friends successfully")
                        .data(null)
                        .build()
        );
    }
}

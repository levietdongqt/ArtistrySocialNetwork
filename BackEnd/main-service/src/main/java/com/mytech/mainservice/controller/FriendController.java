package com.mytech.mainservice.controller;

import com.mytech.mainservice.dto.ResponseObject;
import com.mytech.mainservice.dto.UserDTO;
import com.mytech.mainservice.dto.request.FriendDTO;
import com.mytech.mainservice.service.IFriendService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<?> getFriends(@PathVariable String userId) {
        Set<UserDTO> friends = friendService.getFriends(userId);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Get Friends successfully")
                        .data(friends)
                        .build()
        );
    }

    @PreAuthorize("@jwtTokenHolder.isValidUserId(#friendDTO.userId()) && hasRole('USER')")
    @PostMapping("/acceptFriend")
    public ResponseEntity<?> acceptFriend(@RequestBody FriendDTO friendDTO) {
        friendService.acceptFriendRequest(friendDTO.userId(), friendDTO.friendId());
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Accept Friend successfully")
                        .data(null)
                        .build()
        );
    }

    @PreAuthorize("@jwtTokenHolder.isValidUserId(#friendDTO.userId()) && hasRole('USER')")
    @PostMapping("/addFriend")
    public ResponseEntity<?> addFriend(@RequestBody FriendDTO friendDTO) {
        friendService.addFriend(friendDTO.userId(), friendDTO.friendId());
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Add Friend successfully")
                        .data(null)
                        .build()
        );
    }
}

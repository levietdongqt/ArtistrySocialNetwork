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
    @PreAuthorize("@jwtTokenHolder.isValidUserId(#userId) && hasRole('USER')")
    @GetMapping("/follow/{userId}")
    public ResponseEntity<?> getFollowedFriends(@PathVariable String userId) {
        List<UserDTO> friends = friendService.getFollowedFriends(userId);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Get followed Friends successfully")
                        .data(friends)
                        .build()
        );
    }

    @PreAuthorize("@jwtTokenHolder.isValidUserId(#userId) && hasRole('USER')")
    @GetMapping("/is-friend/{userId}")
    public ResponseEntity<?> getIsFriendedFriends(@PathVariable String userId) {
        List<UserDTO> friends = friendService.getIsFriendFriends(userId);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Get is friends Friends successfully")
                        .data(friends)
                        .build()
        );
    }

    @PreAuthorize("@jwtTokenHolder.isValidUserId(#userId) && hasRole('USER')")
    @GetMapping("/pending/{userId}")
    public ResponseEntity<?> getPendingFriends(@PathVariable String userId) {
        List<UserDTO> friends = friendService.getPendingFriends(userId);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Get pending Friends successfully")
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
    @PostMapping("/unAcceptFriend")
    public ResponseEntity<?> unAcceptFriend(@RequestBody FriendDTO friendDTO) {
        friendService.declineFriendRequest(friendDTO.userId(), friendDTO.friendId());
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Decline Friend successfully")
                        .data(null)
                        .build());
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
    @PreAuthorize("@jwtTokenHolder.isValidUserId(#friendDTO.userId()) && hasRole('USER')")
    @PostMapping("/removeFriend")
    public ResponseEntity<?> removeFriend(@RequestBody FriendDTO friendDTO) {
        friendService.deleteFriend(friendDTO.userId(), friendDTO.friendId());
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Remove Friend successfully")
                        .data(null)
                        .build()
        );
    }

    @PreAuthorize("@jwtTokenHolder.isValidUserId(#friendDTO.userId()) && hasRole('USER')")
    @PostMapping("/followFriend")
    public ResponseEntity<?> followFriend(@RequestBody FriendDTO friendDTO) {
        friendService.followingFriendRequest(friendDTO.userId(), friendDTO.friendId());
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Follow Friend successfully")
                        .data(null)
                        .build()
        );
    }
    @PreAuthorize("@jwtTokenHolder.isValidUserId(#friendDTO.userId()) && hasRole('USER')")
    @PostMapping("/unFollowFriend")
    public ResponseEntity<?> unFollowFriend(@RequestBody FriendDTO friendDTO) {
        friendService.unfollowingFriendRequest(friendDTO.userId(), friendDTO.friendId());
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("UnFollow Friend successfully")
                        .data(null)
                        .build()
        );
    }


}

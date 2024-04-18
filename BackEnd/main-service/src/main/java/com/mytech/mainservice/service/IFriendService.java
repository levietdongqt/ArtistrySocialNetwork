package com.mytech.mainservice.service;

import com.mytech.mainservice.dto.UserDTO;

import java.util.Set;

public interface IFriendService {
    void addFriend(String userId, String friendId);
    void deleteFriend(String userId, String friendId);
    boolean acceptFriendRequest(String userId, String friendId);
    void declineFriendRequest(String userId, String friendId);
    void blockFriend(String userId, String friendId);
    void unblockFriend(String userId, String friendId);
    Set<UserDTO> getFriends(String userId);

    void followingFriendRequest(String userId, String friendId);

    void unfollowingFriendRequest(String userId, String friendId);

}

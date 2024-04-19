package com.mytech.mainservice.service;

import com.mytech.mainservice.dto.UserDTO;

import java.util.List;
import java.util.Set;

public interface IFriendService {
    void addFriend(String userId, String friendId);
    void deleteFriend(String userId, String friendId);
    boolean acceptFriendRequest(String userId, String friendId);
    void declineFriendRequest(String userId, String friendId);
    void blockFriend(String userId, String friendId);
    void unblockFriend(String userId, String friendId);
    List<UserDTO> getFollowedFriends(String userId);

    List<UserDTO> getIsFriendFriends(String userId);

    List<UserDTO> getPendingFriends(String userId);

    void followingFriendRequest(String userId, String friendId);

    void unfollowingFriendRequest(String userId, String friendId);

}

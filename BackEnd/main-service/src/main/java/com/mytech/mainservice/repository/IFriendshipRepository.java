package com.mytech.mainservice.repository;

import com.mytech.mainservice.enums.FriendShipStatus;
import com.mytech.mainservice.model.Friendship;
import com.mytech.mainservice.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.Set;

@Repository
public interface IFriendshipRepository extends JpaRepository<Friendship, Long> {

    @Query("SELECT f.friend FROM Friendship f WHERE f.fromUser.id = :userId")
    Set<User> getFriends(@Param("userId") String userId);
    @Query("SELECT f.friend.id, f.friend.avatar, f.friend.fullName,f.friend.coverImage FROM Friendship f INNER JOIN User u ON u.id = f.fromUser.id WHERE u.id = :userId")
    Set<User> getFriends2(@Param("userId") String userId);

    Optional<Friendship> findByFromUser_IdAndFriend_Id (String fromUserId, String friendId);

    @Query("SELECT f.status FROM Friendship f " +
            "WHERE (f.fromUser.id = :userTo and f.friend.id = :userId) " +
            "or (f.fromUser.id = :userId and f.friend.id = :userTo)")
    String getStatusFriend(@Param("userTo") String userTo, @Param("userId") String userId);

}
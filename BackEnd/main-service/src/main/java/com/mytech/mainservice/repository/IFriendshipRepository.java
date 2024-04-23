package com.mytech.mainservice.repository;

import com.mytech.mainservice.enums.FriendShipStatus;
import com.mytech.mainservice.model.Friendship;
import com.mytech.mainservice.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface IFriendshipRepository extends JpaRepository<Friendship, Long> {

    @Query("SELECT f.friend FROM Friendship f WHERE f.fromUser.id = :userId")
    Set<User> getFriends(@Param("userId") String userId);
    @Query("SELECT f.friend.id, f.friend.avatar, f.friend.fullName,f.friend.coverImage FROM Friendship f INNER JOIN User u ON u.id = f.fromUser.id WHERE u.id = :userId")
    Set<User> getFriends2(@Param("userId") String userId);

    @Query("SELECT f FROM Friendship f WHERE f.friend.id = :userId or f.fromUser.id = :userId")
    List<Friendship> getAllFriendShipByUserId(@Param("userId") String userId);

    @Query("SELECT f FROM Friendship f WHERE f.fromUser.id = :userId")
    List<Friendship> getFriendShipByUserId(@Param("userId") String userId);

    @Query("SELECT f FROM Friendship f WHERE f.fromUser.id =:fromUserId and f.friend.id =:friendId")
    Optional<Friendship> findByFromUser_IdAndFriend_Id (@Param("fromUserId")String fromUserId,@Param("friendId") String friendId);


}
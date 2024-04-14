package com.mytech.mainservice.service.implement;

import com.mytech.mainservice.dto.UserDTO;
import com.mytech.mainservice.enums.FriendShipStatus;
import com.mytech.mainservice.model.Friendship;
import com.mytech.mainservice.model.User;
import com.mytech.mainservice.repository.IFriendshipRepository;
import com.mytech.mainservice.repository.IUserRepository;
import com.mytech.mainservice.service.IFriendService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class FriendService implements IFriendService {

    @Autowired
    private IFriendshipRepository friendshipRepo;
    @Autowired
    private IUserRepository userRepo;
    @Autowired
    private ModelMapper modelMapper;

    @Override
    
    public void addFriend(String userId, String friendId) {
        Optional<Friendship> friendship = friendshipRepo.findByFromUser_IdAndFriend_Id(userId, friendId);
        if(friendship.isPresent()){
            throw new RuntimeException("Friendship already exists");
        }
        Friendship newFriendship = Friendship.builder()
                .friend(User.builder().id(friendId).build())
                .fromUser(User.builder().id(friendId).build())
                .status(FriendShipStatus.FOLLOWING).build();
        friendshipRepo.save(newFriendship);
    }

    @Override
    public void deleteFriend(String userId, String friendId) {
        Optional<Friendship> friendship = friendshipRepo.findByFromUser_IdAndFriend_Id(userId, friendId);
        friendship.ifPresent(value -> friendshipRepo.delete(value));
        throw new RuntimeException("Friendship is not found");
    }

    @Override
    public boolean acceptFriendRequest(String userId, String friendId) {
        Optional<Friendship> friendship = friendshipRepo.findByFromUser_IdAndFriend_Id(userId, friendId);
        if (friendship.isPresent()) {
            friendship.get().setStatus(FriendShipStatus.ISFRIEND);
            friendshipRepo.save(friendship.get());
        }
        throw new RuntimeException("Friendship is not found");
    }

    @Override
    public void declineFriendRequest(String userId, String friendId) {

    }

    @Override
    public void blockFriend(String userId, String friendId) {

    }

    @Override
    public void unblockFriend(String userId, String friendId) {

    }

    @Override
    public Set<UserDTO> getFriends(String userId) {
        Set<User> friends = friendshipRepo.getFriends(userId);
        return friends.stream()
                .map(friend -> modelMapper.map(friend, UserDTO.class))
                .collect(Collectors.toSet());
    }
}

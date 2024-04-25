package com.mytech.mainservice.service.implement;

import com.mytech.mainservice.client.NotificationForeignClient;
import com.mytech.mainservice.dto.FriendDTO;
import com.mytech.mainservice.dto.IsCheckFriendDTO;
import com.mytech.mainservice.dto.NotificationDTO;
import com.mytech.mainservice.dto.UserDTO;
import com.mytech.mainservice.enums.FriendShipStatus;
import com.mytech.mainservice.helper.JwtTokenHolder;
import com.mytech.mainservice.model.Friendship;
import com.mytech.mainservice.model.User;
import com.mytech.mainservice.repository.IFriendshipRepository;
import com.mytech.mainservice.repository.IUserRepository;
import com.mytech.mainservice.service.IFriendService;
import com.mytech.mainservice.service.IUserService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
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
    @Autowired
    private JwtTokenHolder jwtTokenHolder;
    @Autowired
    private IUserService userService;

    @Autowired
    private NotificationForeignClient notificationForeignClient;

    @Override
    
    public void addFriend(String userId, String friendId) {
        if(userId.equals(friendId)){
            throw new RuntimeException("Bạn không thể kết bạn với chính mình");
        }
        Optional<Friendship> friendship = friendshipRepo.findByFromUser_IdAndFriend_Id(userId, friendId);
        Optional<Friendship> reverseFriend  = friendshipRepo.findByFromUser_IdAndFriend_Id(friendId, userId);
        if(friendship.isPresent()){
            //TH1: Check ngược lại friend => user
            if (reverseFriend.isPresent()){
                handleIfFriendshipExisted(reverseFriend.get(),"Đã tồn tại lời mời từ "+ friendId + " đến "+userId);
            }
            //TH2: Nếu không tồn tại lời mời ngược
            handleIfFriendshipExisted(friendship.get(),"Đã tồn tại lời mời kết bạn");
            var status = friendship.get().getStatus();
            status.add(FriendShipStatus.PENDING);
            friendship.get().setStatus(status);
            friendshipRepo.save(friendship.get());
            sendNotificationAfterAddFriendship(userId,friendId,"FRIEND","đã gửi lời mời kết bạn");
            return;
        }
        //Trường hợp 3: chi có lời mời ngược
        if(reverseFriend.isPresent()){
            handleIfFriendshipExisted(reverseFriend.get(),"Đã tồn tại lời mời từ "+ friendId + " đến "+userId);
            return;
        }
        //Trường hợp 4 : chưa tồn tại tạo mới
        Friendship newFriendship = Friendship.builder()
                .friend(User.builder().id(friendId).build())
                .fromUser(User.builder().id(userId).build())
                .status(List.of(FriendShipStatus.FOLLOWING,FriendShipStatus.PENDING)).build();
        friendshipRepo.save(newFriendship);
        //Send notification
        sendNotificationAfterAddFriendship(userId,friendId,"FRIEND","đã gửi lời mời kết bạn");
    }

    @Override
    public void deleteFriend(String userId, String friendId) {
        Optional<Friendship> friendship = friendshipRepo.findByFromUser_IdAndFriend_Id(userId, friendId);
        Optional<Friendship> reverseFriend  = friendshipRepo.findByFromUser_IdAndFriend_Id(friendId, userId);
        if (friendship.isPresent()) {
            if(reverseFriend.isPresent()) {
                handleDeleteFriendship(reverseFriend.get());
            }
            handleDeleteFriendship(friendship.get());
            return;
        }
        if(reverseFriend.isPresent()) {
            handleDeleteFriendship(reverseFriend.get());
            return;
        }
        throw new RuntimeException("Friendship is not found");


    }

    @Override
    public boolean acceptFriendRequest(String userId, String friendId) {
        if(userId.equals(friendId)){
            throw new RuntimeException("Bạn không thể kết bạn với chính mình");
        }
        Optional<Friendship> friendship = friendshipRepo.findByFromUser_IdAndFriend_Id(friendId, userId);
        if (friendship.isPresent()) {
            var status = handleListStatus(friendship.get());
            status.add(FriendShipStatus.ISFRIEND);
            friendship.get().setStatus(status);
            friendshipRepo.save(friendship.get());
            sendNotificationAfterAddFriendship(userId,friendId,"ACCEPT_FRIEND","đã chấp nhận lời mời kết bạn");
            return true;
        }
        throw new RuntimeException("Friendship is not found");
    }

    @Override
    public void declineFriendRequest(String userId, String friendId) {
        if(userId.equals(friendId)){
            throw new RuntimeException("Bạn không thể hủy kết bạn với chính mình");
        }
        Optional<Friendship> friendship = friendshipRepo.findByFromUser_IdAndFriend_Id(friendId, userId);
        if (friendship.isPresent()) {
            var status = handleListStatus(friendship.get());
            friendship.get().setStatus(status);
            //Nếu không còn quan hệ gì cả, nghĩa là status = empty => xóa friendship
            if (status.isEmpty()) {
                friendshipRepo.delete(friendship.get());
                return;
            }
            friendshipRepo.save(friendship.get());
            return;
        }
        throw new RuntimeException("Bạn chưa nhận được lời mời kết bạn");
    }

    @Override
    public void returnAddFriend(String userId, String friendId) {
        if(userId.equals(friendId)){
            throw new RuntimeException("Bạn không thể rút lại lời mời kết bạn với chính mình");
        }
        Optional<Friendship> friendship = friendshipRepo.findByFromUser_IdAndFriend_Id(userId, friendId);
        if (friendship.isPresent()) {
            var checkPendingStatus = checkStatusInFriendship(friendship.get(),FriendShipStatus.PENDING);
            if(checkPendingStatus){
                var status = friendship.get().getStatus();
                status.remove(FriendShipStatus.PENDING);
                friendship.get().setStatus(status);
                friendshipRepo.save(friendship.get());
                return;
            }
        }
        throw new RuntimeException("Bạn chưa gửi lời mời kết bạn");
    }

    @Override
    public void blockFriend(String userId, String friendId) {

    }

    @Override
    public void unblockFriend(String userId, String friendId) {

    }

    @Override
    public List<UserDTO> getFollowedFriends(String userId) {
        List<User> friends = FilterUserByStatus(userId,FriendShipStatus.FOLLOWING);
        return friends
                .stream()
                .map(friend -> modelMapper.map(friend,UserDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<UserDTO> getIsFriendFriends(String userId) {
        List<User> friends = new ArrayList<User>();
        //Lấy ra toàn bộ dữ liệu trong bảng friendship có chưa userId
        List<Friendship> friendships = friendshipRepo.getAllFriendShipByUserId(userId);

        //Lọc lại dữ liệu để lấy ra dữ liệu có status = ISFRIEND
        List<Friendship> friendsWithStatusIsFriendship = friendships
                .stream()
                .filter(friendship -> checkStatusInFriendship(friendship,FriendShipStatus.ISFRIEND))
                .toList();
        //Add dữ liệu vào mảng
        friendsWithStatusIsFriendship.forEach(friendship -> {
            if (friendship.getFriend().getId().equals(userId)) {
                var fromUser = friendship.getFromUser();
                friends.add(fromUser);
            }else{
                var friend = friendship.getFriend();
                friends.add(friend);
            }
        });
        return friends
                .stream()
                .map(friend -> modelMapper.map(friend,UserDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<UserDTO> getPendingFriends(String userId) {
        List<User> friends = FilterUserByStatus(userId,FriendShipStatus.PENDING);
        return friends
                .stream()
                .map(friend -> modelMapper.map(friend,UserDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public void followingFriendRequest(String userId, String friendId) {
        if(userId.equals(friendId)){
            throw new RuntimeException("Bạn không thể follow với chính mình");
        }
        Optional<Friendship> friendship = friendshipRepo.findByFromUser_IdAndFriend_Id(userId, friendId);
        if (friendship.isPresent()) {
            var checkFollowingStatus = checkStatusInFriendship(friendship.get(),FriendShipStatus.FOLLOWING);
            if (checkFollowingStatus) {
                throw new RuntimeException("Đã follow "+friendId+" rồi");
            }
            var status = friendship.get().getStatus();
            status.add(FriendShipStatus.FOLLOWING);
            friendship.get().setStatus(status);
            friendshipRepo.save(friendship.get());
            sendNotificationAfterAddFriendship(userId,friendId,"FOLLOWING","đã theo dõi bạn");
            return;
        }
        Friendship newFriendship = Friendship.builder()
                .friend(User.builder().id(friendId).build())
                .fromUser(User.builder().id(userId).build())
                .status(List.of(FriendShipStatus.FOLLOWING)).build();
        friendshipRepo.save(newFriendship);
        sendNotificationAfterAddFriendship(userId,friendId,"FOLLOWING","đã theo dõi bạn");
    }

    @Override
    public void unfollowingFriendRequest(String userId, String friendId) {
        if(userId.equals(friendId)){
            throw new RuntimeException("Bạn không thể unfollow với chính mình");
        }
        Optional<Friendship> friendship = friendshipRepo.findByFromUser_IdAndFriend_Id(userId, friendId);
        if (friendship.isPresent()) {
            var checkFollowingStatus = checkStatusInFriendship(friendship.get(),FriendShipStatus.FOLLOWING);
            if (!checkFollowingStatus) {
                throw new RuntimeException("Chưa follow "+friendId);
            }
            var status = friendship.get().getStatus();
            status.remove(FriendShipStatus.FOLLOWING);
            //Nếu không còn quan hệ gì cả, nghĩa là status = empty => xóa friendship
            if (status.isEmpty()) {
                friendshipRepo.delete(friendship.get());
                return;
            }
            friendship.get().setStatus(status);
            friendshipRepo.save(friendship.get());
            return;
        }
        throw new RuntimeException("Chưa tồn tại quan hệ bạn bè");
    }

    @Override
    public List<UserDTO> searchByName(String search) {
        List<User> users = userRepo.findFriendByFullname(jwtTokenHolder.getUserId(), search);
        return users.stream().map(user -> modelMapper.map(user, UserDTO.class)).toList();
    }
    @Override
    public IsCheckFriendDTO isFollowingAndIsFriend(String userId, String friendId) {
        if(userId.equals(friendId)){
            throw new RuntimeException("Không có quan hệ với chính mình");
        }
        boolean isFollowing = false;
        boolean isFriend = false;
        boolean isPending = false;
        boolean isAcceptFriend = false;
        Optional<Friendship> friendship= friendshipRepo.findByFromUser_IdAndFriend_Id(userId, friendId);
        Optional<Friendship> reverseFriendship =  friendshipRepo.findByFromUser_IdAndFriend_Id(friendId, userId);
        if (friendship.isPresent()) {
            var checkFollowingStatus = checkStatusInFriendship(friendship.get(),FriendShipStatus.FOLLOWING);
            isFollowing = checkFollowingStatus;
            var checkFriendStatus = checkStatusInFriendship(friendship.get(),FriendShipStatus.ISFRIEND);
            isFriend = checkFriendStatus;
            var checkPendingStatus = checkStatusInFriendship(friendship.get(),FriendShipStatus.PENDING);
            isPending = checkPendingStatus;

        }
        if(reverseFriendship.isPresent()){
            var checkIsAcceptFriend = checkStatusInFriendship(reverseFriendship.get(),FriendShipStatus.PENDING);
            isAcceptFriend = checkIsAcceptFriend;
        }
        if (isFriend) {
            return IsCheckFriendDTO.builder().isFriend(true).isFollow(isFollowing).isPending(isPending).isAcceptFriend(isAcceptFriend).build();
        }
        if (reverseFriendship.isPresent()) {
            var checkFriendStatus = checkStatusInFriendship(reverseFriendship.get(),FriendShipStatus.ISFRIEND);
            isFriend = checkFriendStatus;
        }
        return IsCheckFriendDTO.builder().isFriend(isFriend).isFollow(isFollowing).isAcceptFriend(isAcceptFriend).isPending(isPending).build();
    }

    @Override
    public List<FriendDTO> searchFriend(String userId, List<String> listIdSearch) {
        List<FriendDTO> friendDTOs = new ArrayList<>();
        listIdSearch.forEach(id -> {
            var userDTO = userService.getUserById(id);
            var isCheckFriend = isFollowingAndIsFriend(userId,id);
            var friendDTO = FriendDTO.builder().user(userDTO).isCheckFriend(isCheckFriend).build();
            friendDTOs.add(friendDTO);
        });
        return friendDTOs;
    }

    //Handler status friendships

    private List<FriendShipStatus> handleListStatus(Friendship friendship){
        List<FriendShipStatus> status = friendship.getStatus();
        var checkStatus = status.stream().filter(st -> st.equals(FriendShipStatus.PENDING)).findFirst();
        if(!checkStatus.isPresent()) {
            throw new RuntimeException("Friendship status is not pending");
        }
        status.remove(FriendShipStatus.PENDING);
        return status;
    }

    private boolean checkStatusInFriendship(Friendship friendship,FriendShipStatus checkedStatus){
        List<FriendShipStatus> status = friendship.getStatus();
        var checkStatus = status.stream().filter(st -> st.equals(checkedStatus)).findFirst();
        if(checkStatus.isPresent()) {
            return true;
        }
        return false;
    }

    private void handleIfFriendshipExisted(Friendship friendship,String messageIsPending){
        var checkISFRIENDStatus = checkStatusInFriendship(friendship,FriendShipStatus.ISFRIEND);
        if (checkISFRIENDStatus) {
            throw new RuntimeException("Đã là bạn bè");
        }
        //Trường hợp 2: tồn tại PENDING => sẽ ko gửi nữa
        var checkPENDINGStatus = checkStatusInFriendship(friendship,FriendShipStatus.PENDING);
        if (checkPENDINGStatus) {
            throw new RuntimeException(messageIsPending);
        }
    }

    private void handleDeleteFriendship(Friendship friendship){
        if (checkStatusInFriendship(friendship,FriendShipStatus.ISFRIEND)){
            var status = friendship.getStatus();
            status.remove(FriendShipStatus.ISFRIEND);
            if(status.isEmpty()){
                friendshipRepo.delete(friendship);
                return;
            }
            friendship.setStatus(status);
            friendshipRepo.save(friendship);
        }
    }

    private List<User> FilterUserByStatus(String userId,FriendShipStatus status) {
        List<User> friends = new ArrayList<User>();
        List<Friendship> friendships = friendshipRepo.getFriendShipByUserId(userId);
        List<Friendship> friendshipWithPending = friendships
                .stream()
                .filter(friendship -> checkStatusInFriendship(friendship,status))
                .collect(Collectors.toList());
        friendshipWithPending.forEach(friendship -> friends.add(friendship.getFriend()));
        return friends;

    }

    private void sendNotificationAfterAddFriendship(String userId, String friendId,String type,String message){
        UserDTO user = userService.getUserById(userId);
        UserDTO friend = userService.getUserById(friendId);
        NotificationDTO notificationDTO = NotificationDTO.builder()
                .userFrom(friend)
                .userTo(user)
                .notificationType(type)
                .message(message)
                .link(user.getId())
                .build();
        notificationForeignClient.saveNotification(notificationDTO);
    }
}

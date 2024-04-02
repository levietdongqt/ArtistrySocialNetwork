package com.mytech.realtimeservice.services;

import com.mytech.realtimeservice.client.FriendForeignClient;
import com.mytech.realtimeservice.dto.PostDTO;
import com.mytech.realtimeservice.dto.UserDTO;
import com.mytech.realtimeservice.enums.NotificationType;
import com.mytech.realtimeservice.models.Notification;
import com.mytech.realtimeservice.models.Post;
import com.mytech.realtimeservice.models.users.User;
import com.mytech.realtimeservice.repositories.NotificationRepository;
import com.mytech.realtimeservice.repositories.PostRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    FriendForeignClient friendForeignClient;

    public Post create(PostDTO postDTO) {
        // Lưu bài post
        Post post = Post.builder()
                .user(User.builder()
                        .userId(postDTO.getSendUserId())
                        .userName(postDTO.getSendUserName())
                        .avatar(postDTO.getSendUserAvatarUrl())
                        .build())
                .content(postDTO.getContent())
                .createdAt(LocalDateTime.now())
                .mediaUrl(postDTO.getMediaUrl())
                .createdBy(postDTO.getSendUserId())
                .build();
        var createdPost = postRepository.save(post);
        //Lấy ra danh sách bạn bè của chủ bài post, gọi từ main service
        //List<String> userIds = List.of("a125b897-1012-4e8c-ac64-60e3263f7252","b","c","d");
        var friendForeignClientFriends = friendForeignClient.getFriends(postDTO.getSendUserId());
        //Tạo ra các notification cho danh sách bạn bè này
        List<Notification> notifications = new ArrayList<>();
        User userTo = User.builder()
                .userId(postDTO.getSendUserId())
                .userName(postDTO.getSendUserName())
                .avatar(postDTO.getSendUserAvatarUrl()).build();
        for (UserDTO userDTO : friendForeignClientFriends.getData()) {
           var userFrom = User.builder().userId(userDTO.getId()).userName(userDTO.getFullName()).avatar(userDTO.getAvatar()).build();
           notificationService.sendNotification(userFrom, userTo,"NORMAL",postDTO.getContent(),createdPost.getId());
        }
        return createdPost;
    }
    public List<Post> findAll() {
        return postRepository.findAll();
    }

    public void deleteAll() {
        postRepository.deleteAll();
    }

    public Post findById(String id) {
        return postRepository.findById(id).get();
    }

}

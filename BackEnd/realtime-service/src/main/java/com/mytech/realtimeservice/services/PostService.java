package com.mytech.realtimeservice.services;

import com.mytech.realtimeservice.client.FriendForeignClient;
import com.mytech.realtimeservice.converter.ConverterObject;
import com.mytech.realtimeservice.dto.PostDTO;
import com.mytech.realtimeservice.dto.PostLikeDTO;
import com.mytech.realtimeservice.dto.UserDTO;
import com.mytech.realtimeservice.enums.NotificationType;
import com.mytech.realtimeservice.models.Notification;
import com.mytech.realtimeservice.dto.PostResponse;

import com.mytech.realtimeservice.models.Post;
import com.mytech.realtimeservice.models.PostLike;
import com.mytech.realtimeservice.models.users.User;
import com.mytech.realtimeservice.repositories.*;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
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
    private NotificationService notificationService;

    @Autowired
    private FriendForeignClient friendForeignClient;


    @Autowired
    private PostLikeRepository postLikeRepository;

    @Autowired
    private PostELSRepository postELSRepository;
    @Autowired
    private ModelMapper modelMapper;

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
        //Lưu vào ELS
        var ESLpost =  ConverterObject.convertPostToPostELS(createdPost);
        postELSRepository.save(ESLpost);
        //Lấy ra danh sách bạn bè của chủ bài post, gọi từ main service
        var friendForeignClientFriends = friendForeignClient.getFriends(postDTO.getSendUserId());
        //Nếu như có userTags
        if (postDTO.getUserTags()!= null && postDTO.getUserTags().size() > 0) {
          setTagForUsers(friendForeignClientFriends.getData(),postDTO.getUserTags());
        }
        //Tạo ra các notification cho danh sách bạn bè này
        User userTo = User.builder()
                .userId(postDTO.getSendUserId())
                .userName(postDTO.getSendUserName())
                .avatar(postDTO.getSendUserAvatarUrl()).build();
        for (UserDTO userDTO : friendForeignClientFriends.getData()) {
           var userFrom = User.builder().userId(userDTO.getId()).userName(userDTO.getFullName()).avatar(userDTO.getAvatar()).build();
           if (userDTO.isTag()) {
               notificationService.sendNotification(userFrom, userTo,"TAG",postDTO.getContent(),createdPost.getId());
           }else{
               notificationService.sendNotification(userFrom, userTo,"NORMAL",postDTO.getContent(),createdPost.getId());
           }
        }
        return createdPost;


    }
    public List<PostResponse> findAll() {
        List<Post> posts = postRepository.findAll();
        List<PostResponse> postResponses = new ArrayList<>();
        postResponses = modelMapper.map(posts,postResponses.getClass());
        return postResponses;
    }

    public void deleteAll() {
        postRepository.deleteAll();
    }

    public Post findById(String id) {
        return postRepository.findById(id).get();
    }

    //Set tag thành true nếu như id trùng id của  List<UserDTO> trả từ main (tối ưu sau)
    public void setTagForUsers(List<UserDTO> users,List<UserDTO> userTags) {
        users.forEach(userDTO -> {
            userTags.forEach(userTag -> {
                if (userDTO.getId().equals(userTag.getId())) {
                    userDTO.setTag(true);
                }
            });
        });
    }
    //Service xử lý like cho 1 bài Post
    public Post updateLikeForPost(String postId,User userLike) {
        var post = findById(postId);
        if (post == null) {
            return null;
        }
        post.setTotalLikes(post.getTotalLikes() + 1);
        List<User> users = post.getUserPostLikes();
        users.add(userLike);
        post.setUserPostLikes(users);
        post.setUpdatedAt(LocalDateTime.now());
        return postRepository.save(post);
    }


    public Post updateDislikeForPost(String postId,User userLike) {
        User deletedUser = null;
        var post = findById(postId);
        if (post == null) {
            return null;
        }
        post.setTotalLikes(post.getTotalLikes() - 1);
        List<User> users = post.getUserPostLikes();
        deletedUser = users
                .stream()
                .filter(u -> u.getUserId().equals(userLike.getUserId()))
                .findFirst()
                .get();
        users.remove(deletedUser);
        post.setUpdatedAt(LocalDateTime.now());
        return postRepository.save(post);
    }

    //Xử lý likes và unlikes cho 1 bài post
    public Post createPostLike(PostLikeDTO postLikeDTO) {
        //Kiểm tra xem phải đúng bài post cần tạo like không?
        Post postUpdated = null;
        var post = findById(postLikeDTO.getPostId());
        if ( post== null){
            return null;
        }

        //Xóa postlike
        var postLike = postLikeRepository.GetByPostLikeByPostIdAndUserId(post.getId(), postLikeDTO.getByUser().getUserId());
        if (postLike!= null) {
            postLikeRepository.delete(postLike);
            postUpdated = updateDislikeForPost(post.getId(),postLikeDTO.getByUser());
            return post;
        }

        //Tạo 1 post like
        PostLike postLikeCreated = PostLike.builder()
                            .postId(postLikeDTO.getPostId())
                            .icon(postLikeDTO.getIcon())
                            .byUser(postLikeDTO.getByUser())
                            .createdAt(LocalDateTime.now())
                            .build();
        postLikeRepository.save(postLikeCreated);
        //Update total postlike
        postUpdated = updateLikeForPost(post.getId(),postLikeDTO.getByUser());
        //Tạo 1 notification;
        User userTo = post.getUser();

        User userFrom = User.builder()
                .userId(postLikeDTO.getByUser().getUserId())
                .userName(postLikeDTO.getByUser().getUserName())
                .avatar(postLikeDTO.getByUser().getAvatar())
                .build();
        notificationService.sendNotification(userFrom, userTo,"LIKE","",post.getId());
        return postUpdated;
    }
    //Xử lý comments cho 1 post
    public Post updateCommentsForPost(String postId) {
        var post = findById(postId);
        if (post == null) {
            return null;
        }
        post.setTotalComments(post.getTotalComments() + 1);
        post.setUpdatedAt(LocalDateTime.now());
        return postRepository.save(post);
    }

}

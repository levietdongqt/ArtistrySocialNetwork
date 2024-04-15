package com.mytech.realtimeservice.services;

import com.mytech.realtimeservice.client.FriendForeignClient;
import com.mytech.realtimeservice.dto.*;

import com.mytech.realtimeservice.models.Post;
import com.mytech.realtimeservice.models.PostLike;
import com.mytech.realtimeservice.models.users.User;
import com.mytech.realtimeservice.repositories.PostLikeRepository;
import com.mytech.realtimeservice.repositories.PostRepository;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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
    private ModelMapper modelMapper;

    public Post create(PostDTO postDTO) {
        // Lưu bài post
        Post post = Post.builder()
                .user(User.builder()
                        .id(postDTO.getSendUserId())
                        .fullName(postDTO.getSendFullName())
                        .avatar(postDTO.getSendUserAvatarUrl())
                        .verified(postDTO.getSendVerified())
                        .coverImage(postDTO.getSendUserCoverImage())
                        .bio(postDTO.getSendUserBio())
                        .build())
                .content(postDTO.getContent())
                .createdAt(LocalDateTime.now())
                .mediaUrl(postDTO.getMediaUrl())
                .createdBy(postDTO.getSendUserId())
                .build();
        var createdPost = postRepository.save(post);
        //Lấy ra danh sách bạn bè của chủ bài post, gọi từ main service
        var friendForeignClientFriends = friendForeignClient.getFriends(postDTO.getSendUserId());
        //Nếu như có userTags
        if (postDTO.getUserTags()!= null && postDTO.getUserTags().size() > 0) {
          setTagForUsers(friendForeignClientFriends.getData(),postDTO.getUserTags());
        }
        //Tạo ra các notification cho danh sách bạn bè này
        User userTo = User.builder()
                .id(postDTO.getSendUserId())
                .fullName(postDTO.getSendFullName())
                .avatar(postDTO.getSendUserAvatarUrl())
                .coverImage(postDTO.getSendUserCoverImage())
                .bio(postDTO.getSendUserBio())
                .verified(postDTO.getSendVerified()).build();
        for (UserDTO userDTO : friendForeignClientFriends.getData()) {
           var userFrom = User.builder().id(userDTO.getId()).fullName(userDTO.getFullName()).avatar(userDTO.getAvatar()).build();
           if (userDTO.isTag()) {
               notificationService.sendNotification(userFrom, userTo,"TAG",postDTO.getContent(),createdPost.getId());
           }else{
               notificationService.sendNotification(userFrom, userTo,"NORMAL",postDTO.getContent(),createdPost.getId());
           }
        }
        return createdPost;
    }
    public Boolean deletePost(String postId) {
        boolean detected = false;
        var post = postRepository.findById(postId);
        if(post.isPresent()){
            detected =  true;
            postRepository.delete(post.get());
        }
        return detected;
    }
    public Post getPostById(String postId) {
        Optional<Post> post = postRepository.findById(postId);
        return post.orElse(null);
    }
    public List<PostResponse> findAll(int limit, int offset) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        int pageIndex = offset / limit;
        Pageable pageable = PageRequest.of(pageIndex, limit, sort);
        Page<Post> pagePosts = postRepository.findByOrderByCreatedAtDesc(pageable);
        List<Post> posts = pagePosts.getContent();
        List<PostResponse> postResponses = new ArrayList<>();
        for (Post post : posts) {
            PostResponse postResponse = modelMapper.map(post, PostResponse.class);
            postResponses.add(postResponse);
        }
        return postResponses;
    }
    public long getCountPost(){
        return postRepository.count();
    }

    public boolean deleteAll() {
        postRepository.deleteAll();
        return true;
    }

    public Post findById(String id) {
        return postRepository.findById(id).orElse(null);
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
                .filter(u -> u.getId().equals(userLike.getId()))
                .findFirst()
                .orElse(null);
        System.out.println("user " + deletedUser);
        if (deletedUser != null) {
            users.remove(deletedUser);
        }
        post.setUpdatedAt(LocalDateTime.now());
        return postRepository.save(post);
    }

    //Xử lý likes và unlikes cho 1 bài post
    public Post createPostLike(PostLikeDTO postLikeDTO) {
        //Kiểm tra xem phải đúng bài post cần tạo like không?
        Post postUpdated = null;
        var post = findById(postLikeDTO.getPostId());
        if ( post == null){
            return null;
        }
        //Xóa postlike
        var postLike = postLikeRepository.GetByPostLikeByPostIdAndUserId(post.getId(), postLikeDTO.getByUser().getId());
        if (postLike != null) {
            postLikeRepository.delete(postLike);
            postUpdated = updateDislikeForPost(post.getId(),postLikeDTO.getByUser());
            return post;
        }
        boolean alreadyLiked = post.getUserPostLikes()
                .stream()
                .anyMatch(like ->  postLikeDTO.getByUser().getId().equals(like.getId()));
        if(alreadyLiked){
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
                .id(postLikeDTO.getByUser().getId())
                .fullName(postLikeDTO.getByUser().getFullName())
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
    public Post updateDeleteCommentForPost(String postId) {
        var post = findById(postId);
        if (post == null) {
            return null;
        }
        post.setTotalComments(post.getTotalComments() - 1);
        post.setUpdatedAt(LocalDateTime.now());
        return postRepository.save(post);
    }

}

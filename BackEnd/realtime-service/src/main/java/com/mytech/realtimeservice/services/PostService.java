package com.mytech.realtimeservice.services;

import com.mytech.realtimeservice.client.FriendForeignClient;
import com.mytech.realtimeservice.dto.*;

import com.mytech.realtimeservice.exception.myException.ForbiddenException;
import com.mytech.realtimeservice.exception.myException.NotFoundException;
import com.mytech.realtimeservice.helper.JwtTokenHolder;
import com.mytech.realtimeservice.models.Notification;
import com.mytech.realtimeservice.models.Post;
import com.mytech.realtimeservice.models.PostLike;
import com.mytech.realtimeservice.models.Report;
import com.mytech.realtimeservice.models.users.User;
import com.mytech.realtimeservice.repositories.*;
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
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Slf4j
public class PostService implements IPostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private IReportService reportService;
    @Autowired
    private FriendForeignClient friendForeignClient;

    @Autowired
    private PostLikeRepository postLikeRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private IWSSocket wsSocket;

    @Autowired
    private JwtTokenHolder jwtTokenHolder;

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
        //Lưu vào ELS
        PostELS postELS = PostELS.builder()
                .id(createdPost.getId())
                .content(createdPost.getContent())
                .full_name(createdPost.getUser().getFullName())
                .build();
        friendForeignClient.savePostELS(postELS);
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
               notificationService.sendNotification(userFrom, userTo,"TAG","đã đính kèm bạn vào bài posts của họ",createdPost.getId());
           }else{
               notificationService.sendNotification(userFrom, userTo,"NORMAL","đã tạo một bài post mới với nội dụng là: "+postDTO.getContent(),createdPost.getId());
           }
        }
        return createdPost;
    }
    public Boolean deletePost(String postId) {
        boolean detected = false;
        var post = postRepository.findById(postId);
        if(post.isEmpty() ){
            throw new NotFoundException("Post not found");
        }
        if(jwtTokenHolder.isValidUserId(post.get().getUser().getId())){
            detected =  true;
            postRepository.delete(post.get());
            friendForeignClient.deletePostELS(post.get().getId());
        }
        return detected;
    }
    public Post getPostById(String postId) {
        Optional<Post> post = postRepository.findById(postId);
        return post.orElse(null);
    }
    public List<PostResponse> findAll(int limit, int pageIndex, String userId) {
        List<String> friendsIds = filterFollowFriends(userId);
        if (!friendsIds.contains(userId)) {
            friendsIds.add(userId);
        }
        Set<String> reportedPostIds = reportService.findReportsByUserId(userId)
                .stream()
                .map(Report::getPostId)
                .collect(Collectors.toSet());

        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        Pageable pageable = PageRequest.of(pageIndex, limit, sort);
        Page<Post> pagePosts = postRepository.findByOrderByCreatedAtDesc(friendsIds,reportedPostIds, pageable);
        List<PostResponse> postResponses = pagePosts.getContent().stream()
                .map(post -> modelMapper.map(post, PostResponse.class))
                .collect(Collectors.toList());
        log.info( "page inndex: " + pageIndex+ "post response: " + postResponses.size() );
        return postResponses;
    }
    public List<String> filterFollowFriends(String userId){
        var friendsFollow = friendForeignClient.getFollowFriends(userId);
        return friendsFollow.getData().stream().map(UserDTO::getId).collect(Collectors.toList());
    }
    public long getCountPost(){
        return postRepository.count();
    }

    public boolean deleteAll() {
        postRepository.deleteAll();
        return true;
    }

    public Post findById(String id) {
        var postOptional =  postRepository.findById(id);
        if (postOptional.isPresent()){
            return postOptional.get();
        }
        throw  new NotFoundException("Post is not found");
    }

    public List<PostResponse> findPostByIdInList(List<String> postIds){
        List<Post> posts = postRepository.findByPostIdsIn(postIds);
        List<PostResponse> postResponses = new ArrayList<>();
        for (Post post : posts) {
            PostResponse postResponse = modelMapper.map(post, PostResponse.class);
            postResponses.add(postResponse);
        }
        return postResponses;
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

        post.setTotalLikes(post.getTotalLikes() - 1);
        List<User> users = post.getUserPostLikes();
        deletedUser = users
                .stream()
                .filter(u -> u.getId().equals(userLike.getId()))
                .findFirst()
                .orElse(null);
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
        notificationService.sendNotification(userTo, userFrom,"LIKE","đã like bài viết của bạn",post.getId());
        return postUpdated;
    }
    //Xử lý comments cho 1 post
    public Post updateCommentsForPost(String postId) {
        var post = findById(postId);
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

    public List<Post> getPostByKeyWord(String keyword){
        var posts = postRepository.findByContentContainingIgnoreCaseOrUserFullNameContainingIgnoreCase(keyword,keyword);
        return posts;
    }

}

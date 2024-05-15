package com.mytech.realtimeservice.services;

import com.mytech.realtimeservice.client.FriendForeignClient;
import com.mytech.realtimeservice.dto.*;

import com.mytech.realtimeservice.enums.ReportStatus;
import com.mytech.realtimeservice.exception.myException.NotFoundException;
import com.mytech.realtimeservice.helper.JwtTokenHolder;
import com.mytech.realtimeservice.models.Post;
import com.mytech.realtimeservice.models.PostLike;
import com.mytech.realtimeservice.models.Report;
import com.mytech.realtimeservice.models.users.User;
import com.mytech.realtimeservice.repositories.MyRepository;
import com.mytech.realtimeservice.repositories.PostLikeRepository;
import com.mytech.realtimeservice.repositories.PostRepository;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
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

    @Autowired
    private MyRepository myRepository;
    public PostResponse create(PostDTO postDTO) {
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
                .fullName(createdPost.getUser().getFullName())
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
        return modelMapper.map(createdPost,PostResponse.class);
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
    public void descreasePriorityScore(descendingActionDto descendingActionDto) {
        Optional<Post> post = postRepository.findById(descendingActionDto.getPostId());
        if(post.isEmpty() ){
            throw new NotFoundException("Post not found");
        }
        Post updatedPost = post.get();
        updatedPost.setLeastPrioritized(true);
        updatedPost.setLastInteractionAt(LocalDateTime.now());
        postRepository.save(updatedPost);
    }
    public List<PostResponse> findAll(int limit, int pageIndex, String userId) {
        List<String> friendsIds = filterFollowFriends(userId);
        if (!friendsIds.contains(userId)) {
            friendsIds.add(userId);
        }
        Set<String> reportedPostIds = reportService.findReportsByUserId(userId)
                .stream()
                .filter(status -> status.getStatus().equals(ReportStatus.UNDO))
                .map(Report::getPostId)
                .collect(Collectors.toSet());
        List<Post> newAndTrendingPosts = myRepository.getPostsAndTrendingWithoutDuplicates(friendsIds, reportedPostIds, limit, pageIndex);
        List<PostResponse> postResponses = newAndTrendingPosts.stream().map((element) -> modelMapper.map(element, PostResponse.class)).collect(Collectors.toList());
        log.info("pageIndex: " + pageIndex + " Post limit: " + limit);
        return postResponses;
    }

    public List<PostResponse> findAllNotPag(String userId) {
        List<String> friendsIds = filterFollowFriends(userId);
        if (!friendsIds.contains(userId)) {
            friendsIds.add(userId);
        }
        // Getting trending posts
        List<Post> trending = postRepository.findAll()
                .stream()
                .filter(post -> post.getPriorityScore() > 0)
                .sorted(Comparator.comparingDouble(Post::getPriorityScore).reversed())
                .limit(5)
                .toList();
        // Identifying reported post IDs to exclude
        Set<String> reportedPostIds = reportService.findReportsByUserId(userId)
                .stream()
                .filter(status->status.getStatus().equals(ReportStatus.UNDO))
                .map(Report::getPostId)
                .collect(Collectors.toSet());

        // Extracting all posts, applying filters and sorting as per given order
        List<Post> posts = postRepository.findByOrderByCreatedAtDescNotPag(friendsIds, reportedPostIds)
                .stream()
                .sorted(Comparator.comparingDouble(Post::getEngagementScore)
                        .thenComparing(Post::getCreatedAt).reversed())
                .toList();

        // Mapping to PostResponse DTO
        List<PostResponse> postResponses = posts.stream()
                .map(post -> modelMapper.map(post, PostResponse.class))
                .collect(Collectors.toList());

        // Adding trending posts
        postResponses.addAll(trending.stream()
                .map(post -> modelMapper.map(post, PostResponse.class))
                .toList());
        log.info("Post response: " + postResponses.size());
        return postResponses;
    }
    public double calculateEngagementScore(Post post) {
        double score = 0.0;
        double like = 2.0;
        double comment = 1.0;
        double share = 3.0;
        score += post.getTotalLikes() * like;
        score += post.getTotalComments() * comment;
        score += post.getTotalShares() * share; // giả định bạn đã thêm trường totalShares vào model Post.
        long hoursSinceCreation = ChronoUnit.HOURS.between(post.getCreatedAt(), LocalDateTime.now());
        double freshnessFactor = Math.max(0, 1 - (hoursSinceCreation / 24.0)); // giảm giá trị sau 24 tiếng
        score *= freshnessFactor;
        return score;
    }


    @Override
    public List<PostResponse> findAllById(int limit, int pageIndex, String userId) {

        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        Pageable pageable = PageRequest.of(pageIndex, limit, sort);
        Page<Post> pagePosts = postRepository.findPostByUser(userId, pageable);
        List<PostResponse> postResponses = pagePosts.getContent().stream()
                .map(post -> modelMapper.map(post, PostResponse.class))
                .collect(Collectors.toList());
        return postResponses;
    }

    public List<String> filterFollowFriends(String userId){
        var friendsFollow = friendForeignClient.getFollowFriends(userId);
        return friendsFollow.getData().stream().map(UserDTO::getId).collect(Collectors.toList());
    }

    public PostResponse showTotalLikesByPostId(String postId){
        Optional<Post> getPost = postRepository.showTotalLikesByPostId(postId);
        if(getPost.isEmpty()){
            throw new NotFoundException("No post with postId " + postId);
        }
        return modelMapper.map(getPost.get(), PostResponse.class);
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
        double engagementScore = calculateEngagementScore(post);
        post.setEngagementScore(engagementScore);
        post.setTotalLikes(post.getTotalLikes() + 1);
        post.setPriorityScore(post.getPriorityScore() + 2);
        post.setLastInteractionAt(LocalDateTime.now());
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
        post.setPriorityScore(post.getPriorityScore() - 2);
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

    public List<PostResponse> searchPost(List<String> listId){
        List<PostResponse> posts = new ArrayList<>();
        listId.forEach(id -> {
            var post = postRepository.findById(id);
            if(post.isPresent()){
                PostResponse postResponse = modelMapper.map(post.get(), PostResponse.class);
                posts.add(postResponse);
            }
        });
        return posts;
    }

}

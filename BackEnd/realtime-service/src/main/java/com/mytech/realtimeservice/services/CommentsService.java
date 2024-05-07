package com.mytech.realtimeservice.services;

import com.mytech.realtimeservice.dto.CommentDTO;
import com.mytech.realtimeservice.dto.CommentLikeDTO;
import com.mytech.realtimeservice.dto.UserDTO;
import com.mytech.realtimeservice.exception.myException.NotFoundException;
import com.mytech.realtimeservice.helper.JwtTokenHolder;
import com.mytech.realtimeservice.models.CommentLike;
import com.mytech.realtimeservice.models.Comments;
import com.mytech.realtimeservice.models.Post;
import com.mytech.realtimeservice.models.PostLike;
import com.mytech.realtimeservice.models.users.User;
import com.mytech.realtimeservice.repositories.CommentLikeRepository;
import com.mytech.realtimeservice.repositories.CommentsRepository;
import com.mytech.realtimeservice.repositories.PostRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
public class CommentsService implements ICommentsService {
    @Autowired
    private PostRepository postRepository;


    @Autowired
    private NotificationService notificationService;

    @Autowired
    private PostService postService;

    @Autowired
    private CommentsRepository commentsRepository;

    @Autowired
    private CommentLikeRepository commentLikeRepository;

    @Autowired
    private JwtTokenHolder jwtTokenHolder;

    @Autowired
    private IWSSocket wsSocket;


    public List<Comments> getCommentsByPostId(String postId) {

        return commentsRepository.findAllByPostId(postId).stream().filter(comments -> comments.getParentCommentId() == null).collect(Collectors.toList());
    }

    public List<Comments> getCommentsByParentCommentId(String parentCommentId){
        return commentsRepository.findCommentsByParentCommentId(parentCommentId);
    }
    public Long countCommentsParentId(String parentCommentId){
        return commentsRepository.countParentCommentsId(parentCommentId);
    }
    public Boolean deleteCommentById(String id){
        Optional<Comments> comments = commentsRepository.findCommentsById(id);
        if(comments.isEmpty()){
            return false;
        }
        if(jwtTokenHolder.isValidUserId(comments.get().getByUser().getId())){
            commentsRepository.delete(comments.get());
            postService.updateDeleteCommentForPost(comments.get().getPostId());
            return true;
        }
        return false;
    }
    @Async
    public void updatePriorityScore(String postId){
        var post = postService.findById(postId);
        double engagementScore = calculateEngagementScore(post);
        post.setEngagementScore(engagementScore);
        post.setPriorityScore(post.getPriorityScore() + 1);
        post.setLastInteractionAt(LocalDateTime.now());
        postRepository.save(post);
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
    public Comments createComments(CommentDTO commentDTO) {
        var post = postService.findById(commentDTO.getPostId());
        if (post == null) {
            throw new NotFoundException("Post is not found");
        }
        updatePriorityScore(commentDTO.getPostId());
        //Tạo 1 comments
        Comments comments = Comments.builder()
                .postId(post.getId())
                .byUser(commentDTO.getByUser())
                .content(commentDTO.getContent())
                .sentDate(LocalDateTime.now())
                .mediaUrl(commentDTO.getMediaUrl())
                .tagUserComments(commentDTO.getUserTags())
                .build();
        //Nếu nó là 1 comments đã tồn tại khác
        if (commentDTO.getCommentsParentId() != null ) {
            //Check xem id của comments đã tồn tại đó đúng hay chưa
            var comment = commentsRepository.findById(commentDTO.getCommentsParentId()).orElse(null);
            if (comment == null) {
                throw new NotFoundException("Comment is not found");
            }
            comments.setParentCommentId(comment.getId());
            var createdComment = commentsRepository.save(comments);
            wsSocket.sendGlobalCommentChild(commentDTO.getCommentsParentId(),createdComment);
            //Update comments cho bài post
            comment.setTotalReply(comment.getTotalReply() + 1);
            commentsRepository.save(comment);
            postService.updateCommentsForPost(post.getId());
            //Gửi notification for user
            sendNotificationInComment(commentDTO.getUserTags(),commentDTO.getByUser(),post.getUser(), post.getId());
            return createdComment;
        }

        var createdComment = commentsRepository.save(comments);
        wsSocket.sendGlobalComment(commentDTO.getPostId(),createdComment);
        //Update comments cho bài post
        postService.updateCommentsForPost(post.getId());
        //Gửi notification for user
        sendNotificationInComment(commentDTO.getUserTags(),commentDTO.getByUser(),post.getUser(), post.getId());
        return createdComment;
    }
    public void sendNotificationInComment(List<User> userTags,User userTo,User userFrom,String postId) {
        if (userTags != null ||  !userTags.isEmpty()) {
            for (User user : userTags) {
                var userTag = User.builder()
                        .id(user.getId())
                        .fullName(user.getFullName())
                        .avatar(user.getAvatar())
                        .build();

                notificationService.sendNotification(userTag, userTo, "TAG", "đã đính kèm bạn vào bình luận của họ", postId);
            }
        }
        notificationService.sendNotification(userFrom, userTo,"COMMENT","đã bình luận bài viết của bạn",postId);
    }

    //Service xử lý like cho 1 Comment
    public Comments findCommentById(String id) {
        var commentsOptional =  commentsRepository.findById(id);
        if (commentsOptional.isPresent()){
            return commentsOptional.get();
        }
        throw new NotFoundException("Comment is not found");
    }
    public Comments updateLikeForComment(String commentId,User userLike) {
        var comment = findCommentById(commentId);
        comment.setTotalLikes(comment.getTotalLikes() + 1);
        List<User> users = comment.getCommentsLikes();
        users.add(userLike);
        comment.setCommentsLikes(users);
        comment.setUpdatedDate(LocalDateTime.now());
        return commentsRepository.save(comment);
    }

    public Comments updateDislikeForComment(String commentId,User userLike) {
        User deletedUser = null;
        var comment = findCommentById(commentId);
        comment.setTotalLikes(comment.getTotalLikes() - 1);
        List<User> users = comment.getCommentsLikes();
        deletedUser = users
                .stream()
                .filter(u -> u.getId().equals(userLike.getId()))
                .findFirst()
                .get();
        users.remove(deletedUser);
        comment.setUpdatedDate(LocalDateTime.now());
        return commentsRepository.save(comment);
    }

    public Comments createCommentLike(CommentLikeDTO commentLikeDTO) {
        Comments commentUpdated = null;
        var comment = findCommentById(commentLikeDTO.getCommentId());
        if (comment == null) {
            return null;
        }
        //Xóa comment like
        var commentLike = commentLikeRepository.GetCommentLikeByCommentIdAndUserIdAndPostId(comment.getId(), commentLikeDTO.getByUser().getId(),comment.getPostId());
        if (commentLike != null) {
            commentLikeRepository.delete(commentLike);
            commentUpdated = updateDislikeForComment(comment.getId(),commentLikeDTO.getByUser());
            return commentUpdated;
        }
        var alreadyLiked = comment.getCommentsLikes()
                .stream()
                .anyMatch(likes -> commentLikeDTO.getByUser().getId().equals(likes.getId()));
        if(alreadyLiked) {
            return commentUpdated;
        }
        //Tạo 1 comment like
        CommentLike commentLikeCreated = CommentLike.builder()
                .commentId(commentLikeDTO.getCommentId())
                .icon(commentLikeDTO.getIcon())
                .byUser(commentLikeDTO.getByUser())
                .createdAt(LocalDateTime.now())
                .postId(comment.getPostId())
                .build();
        commentLikeRepository.save(commentLikeCreated);
        //Update total commentlike
        commentUpdated = updateLikeForComment(comment.getId(),commentLikeDTO.getByUser());

        //Tạo 1 notification;
        User userTo = comment.getByUser();
        User userFrom = User.builder()
                .id(commentLikeDTO.getByUser().getId())
                .fullName(commentLikeDTO.getByUser().getFullName())
                .avatar(commentLikeDTO.getByUser().getAvatar())
                .build();
        notificationService.sendNotification(userFrom, userTo,"LIKE","đã thích bình luận của bạn",comment.getId());
        return commentUpdated;
    }
}

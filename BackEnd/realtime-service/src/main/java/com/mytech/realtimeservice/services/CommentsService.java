package com.mytech.realtimeservice.services;

import com.mytech.realtimeservice.dto.CommentDTO;
import com.mytech.realtimeservice.dto.CommentLikeDTO;
import com.mytech.realtimeservice.dto.UserDTO;
import com.mytech.realtimeservice.models.CommentLike;
import com.mytech.realtimeservice.models.Comments;
import com.mytech.realtimeservice.models.Post;
import com.mytech.realtimeservice.models.PostLike;
import com.mytech.realtimeservice.models.users.User;
import com.mytech.realtimeservice.repositories.CommentLikeRepository;
import com.mytech.realtimeservice.repositories.CommentsRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
public class CommentsService {


    @Autowired
    private NotificationService notificationService;

    @Autowired
    private PostService postService;

    @Autowired
    private CommentsRepository commentsRepository;

    @Autowired
    private CommentLikeRepository commentLikeRepository;

    public List<Comments> getCommentsByPostId(String postId) {
        return commentsRepository.findCommentsByPostId(postId);
    }
    public Comments createComments(CommentDTO commentDTO) {
        var post = postService.findById(commentDTO.getPostId());
        if (post == null) {
            return null;
        }
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
        if (commentDTO.getCommentsId() != null ) {
            //Check xem id của comments đã tồn tại đó đúng hay chưa
            var comment = commentsRepository.findById(commentDTO.getCommentsId()).get();
            if (comment == null) {
                return null;
            }
            comments.setCommentId(comment.getId());
            var createdComment = commentsRepository.save(comments);
            //Update comments cho bài post
            comment.setTotalReply(comment.getTotalReply() + 1);
            commentsRepository.save(comment);
            postService.updateCommentsForPost(post.getId());
            //Gửi notification for user
            sendNotificationInComment(commentDTO.getUserTags(),commentDTO.getByUser(),post.getUser(), post.getId());
            return createdComment;
        }
        var createdComment = commentsRepository.save(comments);
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

                notificationService.sendNotification(userTag, userTo, "TAG", null, postId);
            }
        }
        notificationService.sendNotification(userFrom, userTo,"COMMENT",null,postId);
    }

    //Service xử lý like cho 1 Comment
    public Comments findCommentById(String id) {
        return commentsRepository.findById(id).get();
    }
    public Comments updateLikeForComment(String commentId,User userLike) {
        var comment = findCommentById(commentId);
        if (comment == null) {
            return null;
        }
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
        if (comment == null) {
            return null;
        }
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
        notificationService.sendNotification(userFrom, userTo,"LIKE","",comment.getId());
        return commentUpdated;
    }
}

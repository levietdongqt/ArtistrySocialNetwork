package com.mytech.realtimeservice.services;

import com.mytech.realtimeservice.dto.CommentDTO;
import com.mytech.realtimeservice.dto.CommentLikeDTO;
import com.mytech.realtimeservice.models.Comments;
import com.mytech.realtimeservice.models.users.User;

import java.util.List;

public interface ICommentsService {
    public Comments createComments(CommentDTO commentDTO);
    public void sendNotificationInComment(List<User> userTags, User userTo, User userFrom, String postId);
    public Comments findCommentById(String id);
    public Comments updateLikeForComment(String commentId,User userLike);

    public Comments updateDislikeForComment(String commentId,User userLike);

    public Comments createCommentLike(CommentLikeDTO commentLikeDTO);
    List<Comments> getCommentsByPostId(String postId);
    Boolean deleteCommentById(String id);

}

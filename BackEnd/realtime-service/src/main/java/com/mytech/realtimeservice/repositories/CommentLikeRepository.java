package com.mytech.realtimeservice.repositories;

import com.mytech.realtimeservice.models.CommentLike;
import com.mytech.realtimeservice.models.Comments;
import com.mytech.realtimeservice.models.PostLike;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentLikeRepository extends MongoRepository<CommentLike,String> {
    @Query("{ 'commentId' : ?0, 'byUser.userId' : ?1,'postId': ?2 }")
    public CommentLike GetCommentLikeByCommentIdAndUserIdAndPostId(String commentId, String userId,String postId);
}

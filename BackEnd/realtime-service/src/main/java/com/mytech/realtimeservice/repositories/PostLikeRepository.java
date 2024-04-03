package com.mytech.realtimeservice.repositories;

import com.mytech.realtimeservice.models.Post;
import com.mytech.realtimeservice.models.PostLike;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostLikeRepository extends MongoRepository<PostLike,String> {
    @Query("{ 'postId' : ?0, 'byUser.userId' : ?1 }")
    public PostLike GetByPostLikeByPostIdAndUserId(String postId, String userId);


}

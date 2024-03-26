package com.mytech.realtimeservice.repositories;

import com.mytech.realtimeservice.models.PostLike;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostLikeRepository extends MongoRepository<PostLike,String> {
}

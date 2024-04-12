package com.mytech.realtimeservice.repositories;

import com.mytech.realtimeservice.models.Comments;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentsRepository extends MongoRepository<Comments,String> {
    @Query(value = "{postId: ?0}", sort = "{sentDate: -1}")
    List<Comments> findAllByPostId(String postId);

}

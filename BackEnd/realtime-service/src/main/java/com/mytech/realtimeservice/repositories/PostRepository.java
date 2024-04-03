package com.mytech.realtimeservice.repositories;

import com.mytech.realtimeservice.models.Notification;
import com.mytech.realtimeservice.models.Post;
import com.mytech.realtimeservice.models.users.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import org.springframework.data.repository.query.Param;

import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends MongoRepository<Post,String> {

    @Query(value = "{'user.userId': ?0}")
    List<Post> findPostByUser(String userId);



//    @Query(value = "{}", sort = "{ 'createdAt' : -1 }",  = "?0")
//    List<Post> findByOrderByCreatedAtDesc(@Param("limit") int limit);


}

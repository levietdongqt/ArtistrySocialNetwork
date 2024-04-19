package com.mytech.realtimeservice.repositories;

import com.mytech.realtimeservice.models.Notification;
import com.mytech.realtimeservice.models.Post;
import com.mytech.realtimeservice.models.users.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import org.springframework.data.repository.query.Param;

import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PostRepository extends MongoRepository<Post,String> {

    @Query(value = "{'user.userId': ?0}")
    List<Post> findPostByUser(String userId);

    @Query(value = "{'id': ?0}")
    Optional<Post> findPostById(String postId);
    Page<Post> findByOrderByCreatedAtDesc(Pageable pageable);

    long count();

    @Query(value = "{'id': {$in: ?0}}")
    List<Post> findByPostIdsIn(List<String> postIds);

}

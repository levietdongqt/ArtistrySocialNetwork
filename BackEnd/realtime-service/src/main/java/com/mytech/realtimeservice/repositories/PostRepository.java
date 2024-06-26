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
import java.util.Set;

@Repository
public interface PostRepository extends MongoRepository<Post,String> {

    @Query(value = "{'user.id': ?0}")
    Page<Post> findPostByUser(String userId,Pageable pageable);
    @Query(value = "{'id': ?0}")
    Optional<Post> findPostById(String postId);
    @Query(value = "{'_id': {$nin: ?1},'user.id' : { $in: ?0 }}")
    Page<Post> findByOrderByCreatedAtDesc(List<String> userIds, Set<String> reportedPostIds, Pageable pageable);


    @Query(value = "{'id': {$nin: ?1},'user.id' : { $in: ?0 }}",sort = "{'createdAt': -1}")
    List<Post> findByOrderByCreatedAtDescNotPag(List<String> userIds, Set<String> reportedPostIds);
    long count();
    List<Post> findByContentContainingIgnoreCaseOrUserFullNameContainingIgnoreCase(String contentKeyword, String fullNameKeyword);

    @Query(value = "{'id': {$in: ?0}}")
    List<Post> findByPostIdsIn(List<String> postIds);

    @Query(value = "{'priorityScore':{'$gt':0} }")
    Page<Post> findTreddingPosts(Pageable pageable);

    @Query(value = "{'_id': ?0}",fields = "{'totalLikes': 1}")
    Optional<Post> showTotalLikesByPostId(String postId);

}

package com.mytech.realtimeservice.repositories;

import com.mytech.realtimeservice.models.Post;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends MongoRepository<Post,String> {

    List<Post> findByOrderByCreatedAtDesc(Pageable pageable);

    long count();


}

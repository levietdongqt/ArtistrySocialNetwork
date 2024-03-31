package com.mytech.realtimeservice.repositories;

import com.mytech.realtimeservice.models.Comments;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentsRepository extends MongoRepository<Comments,String> {
}

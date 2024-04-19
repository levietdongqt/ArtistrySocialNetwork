package com.mytech.realtimeservice.repositories;

import com.mytech.realtimeservice.models.Report;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReportRepository extends MongoRepository<Report,String> {

    @Query(value = "{'userId': ?0,'postId': ?1}")
    Optional<Report> findByUserIdandPostId(String userId,String postId);
}

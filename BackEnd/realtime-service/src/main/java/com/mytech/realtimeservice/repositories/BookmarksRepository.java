package com.mytech.realtimeservice.repositories;

import com.mytech.realtimeservice.models.BookMarks;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookmarksRepository extends MongoRepository<BookMarks, String> {

    @Query(value = "{'userId': ?0}", sort = "{'createdAt': -1}")
    List<BookMarks> findByUserIdOrderByCreatedAtDesc(String userId);
}

package com.mytech.realtimeservice.repositories;

import com.mytech.realtimeservice.models.NopeNotifications;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface INopeNotificationsRepository extends MongoRepository<NopeNotifications,String> {

    @Query(value = "{'userId': ?0, 'nopeId': ?1}")
    Optional<NopeNotifications> getNopeNotifications(String userId, String nopeId);
}

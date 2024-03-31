package com.mytech.realtimeservice.repositories;

import com.mytech.realtimeservice.models.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification,String> {
    @Query(value = "{'userFrom.userId': ?0, 'status': false,'createdDate': {$gt: ?1}}", sort = "{'createdDate' : -1}")
    List<Notification> findByUserFromUserIdOrderByCreatedDateDesc(String userFromId, Date startDate);

    @Query(value = "{'userFrom.userId': ?0, 'notificationType': type}", sort = "{'createdDate' : -1}")
    List<Notification> findForNotificationsByTypeAndByUserFromId(String userFromId,String type);
}

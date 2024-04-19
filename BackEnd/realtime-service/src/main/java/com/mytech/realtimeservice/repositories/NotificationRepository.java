package com.mytech.realtimeservice.repositories;

import com.mytech.realtimeservice.models.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification,String> {
    @Query(value = "{'userFrom.id': ?0, 'status': false,'createdDate': {$gt: ?1}}", sort = "{'createdDate' : -1}")
    List<Notification> findByUserFromUserIdOrderByCreatedDateDesc(String userFromId, Date startDate);

    @Query(value = "{'userFrom.id': ?0,'createdDate': {$gt: ?1}}", sort = "{'createdDate' : -1}")
    List<Notification> findForNotificationsByUserFromId(String userFromId,Date startDate);

    @Query(value = "{'userFrom.id': ?0, 'delivered': false,'status': false, 'createdDate': {$gt: ?1}}", sort = "{'createdDate' : -1}")
    List<Notification> findNotificationByDelivered(String userFromId, Date startDate);

    @Query(value = "{'userFrom.id': ?0, 'delivered': false,'status': false}", count = true)
    int countNotificationByDelivered(String userFromId);

}

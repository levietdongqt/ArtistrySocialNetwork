package com.mytech.realtimeservice.repositories;

import com.mytech.realtimeservice.models.Message;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.LinkedList;
import java.util.Set;

@Repository
public interface IMessageRepository extends MongoRepository<Message,String> {

    @Query(value = "{'conversationId': ?0}",sort = "{'sendTime':  1}")
    LinkedList<Message> findAllByConversationId(String conversationId);
}

package com.mytech.realtimeservice.repositories;

import com.mytech.realtimeservice.models.Conversation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IConversationRepository extends MongoRepository<Conversation,String> {
}

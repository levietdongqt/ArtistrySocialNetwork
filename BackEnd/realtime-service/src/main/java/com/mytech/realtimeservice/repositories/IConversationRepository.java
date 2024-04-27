
package com.mytech.realtimeservice.repositories;

import com.mytech.realtimeservice.enums.ConversationType;
import com.mytech.realtimeservice.models.Conversation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IConversationRepository extends MongoRepository<Conversation, String> {
    @Query(value = "{'members.id': ?0}", sort = "{'updatedAt' : -1}")
    List<Conversation> getConversationsByUserId(String userId);

    @Query("{'members.id': {$all: ?0}, 'type': ?1}")
    List<Conversation> findConversationsByMemberIdsAAndType(List<String> members, ConversationType type);

    @Query("{ $text: { $search: ?1 } }")
    List<Conversation> findByMemberName(String userId, String searchName);
}


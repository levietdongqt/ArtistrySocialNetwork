
package com.mytech.realtimeservice.repositories;

import com.mytech.realtimeservice.enums.ConversationType;
import com.mytech.realtimeservice.models.Conversation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IConversationRepository extends MongoRepository<Conversation, String> {
    @Query(value = "{$and: [{'members.id': ?0},{'type' : {$ne : 'HIDE'}}]}", sort = "{'updatedAt' : -1}")
    List<Conversation> getByUserIdAndIgnoreTypeHide(String userId);

    @Query("{'members.id': {$all: ?0}, 'type': ?1}")
    List<Conversation> findConversationsByMemberIdsAAndType(List<String> members, ConversationType type);

    @Query("{ $text: { $search: ?1 } }")
    List<Conversation> findByMemberName(String userId, String searchName);

    @Query("{ 'members': { $elemMatch: { 'id': ?0, 'notSeen': true } } }")
    List<Conversation> findUnReads(String userId);

    @Query("{'$and': [" +
            "{'members': {$elemMatch: {'id': ?0}}}," +
            "{'members':  {'$elemMatch': " +
                "{'id': {$ne:  ?0}, $or: [{'nickname': {'$regex': ?1, '$options': 'i'}},{'fullName': {'$regex': ?1, '$options': 'i'}}] }}}" +
            "]}"
    )
    List<Conversation> findByMemberIdAndOtherMembersNicknameContains(String userId, String searchString);

}


package com.mytech.realtimeservice.repositories;


import com.mytech.realtimeservice.dto.ConversationDTO;
import com.mytech.realtimeservice.models.Conversation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.jar.Attributes;

@Repository
public class MyRepository {
    @Autowired
    private MongoTemplate mongoTemplate;

    public void updateConversation(ConversationDTO conversation) {
        Query query = new Query();
        query.addCriteria(Criteria.where("id").is(conversation.getId()));
        Update update = new Update();
        update.set("members", conversation.getMembers())
                .set("updateAt", LocalDateTime.now())
                .set("name", conversation.getName());
        if (conversation.getType() != null) {
            update.set("type", conversation.getType());
        }
        if (conversation.getLastMessage() == null) {
            update.set("lastMessage", null);
        }
        mongoTemplate.updateFirst(query, update, Conversation.class);
    }

}

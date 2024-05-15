package com.mytech.realtimeservice.repositories;


import com.mytech.realtimeservice.dto.ConversationDTO;
import com.mytech.realtimeservice.dto.UserDTO;
import com.mytech.realtimeservice.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Queue;
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
    public void updateUserInRealTime(UserDTO userDTO){
        Query queryPost = new Query();
        Query queryNotify1 = new Query();
        Query queryNotify2 = new Query();
        Query queryPostLike = new Query();
        Query queryComment = new Query();
        Query queryConversation = new Query();
        queryPost.addCriteria(Criteria.where("user.id").is(userDTO.getId()));
        queryNotify1.addCriteria(Criteria.where("userTo.id").is(userDTO.getId()));
        queryNotify2.addCriteria(Criteria.where("userFrom.id").is(userDTO.getId()));
        queryPostLike.addCriteria(Criteria.where("byUser.id").is(userDTO.getId()));
        queryComment.addCriteria(Criteria.where("byUser.id").is(userDTO.getId()));
        queryConversation.addCriteria(Criteria.where("members.id").is(userDTO.getId()));

        Update updatePost = new Update();
        updatePost.set("user.fullName",userDTO.getFullName())
                .set("user.avatar",userDTO.getAvatar())
                .set("user.coverImage",userDTO.getCoverImage())
                .set("user.bio",userDTO.getBio());

        Update updateNotify1 = new Update();
        updateNotify1.set("userTo.fullName",userDTO.getFullName())
                .set("userTo.avatar",userDTO.getAvatar())
                .set("userTo.coverImage",userDTO.getCoverImage())
                .set("userTo.bio",userDTO.getBio());

        Update updateNotify2 = new Update();
        updateNotify2.set("userFrom.fullName",userDTO.getFullName())
                .set("userFrom.avatar",userDTO.getAvatar())
                .set("userFrom.coverImage",userDTO.getCoverImage())
                .set("userFrom.bio",userDTO.getBio());

        Update updatePostLike = new Update();
        updatePostLike.set("byUser.fullName",userDTO.getFullName())
                .set("byUser.avatar",userDTO.getAvatar())
                .set("byUser.coverImage",userDTO.getCoverImage())
                .set("byUser.bio",userDTO.getBio());
        Update updateComment = new Update();
        updateComment.set("byUser.fullName",userDTO.getFullName())
                .set("byUser.avatar",userDTO.getAvatar())
                .set("byUser.coverImage",userDTO.getCoverImage())
                .set("byUser.bio",userDTO.getBio());
        Update updateConversation = new Update();
        updateConversation.set("members.$.fullName",userDTO.getFullName())
                        .set("members.$.avatar",userDTO.getAvatar());

        mongoTemplate.updateMulti(queryPost, updatePost, Post.class);
        mongoTemplate.updateMulti(queryNotify1, updateNotify1, Notification.class);
        mongoTemplate.updateMulti(queryNotify2, updateNotify2, Notification.class);
        mongoTemplate.updateMulti(queryPostLike, updatePostLike, PostLike.class);
        mongoTemplate.updateMulti(queryComment, updateComment, Comments.class);
        mongoTemplate.updateMulti(queryConversation, updateConversation, Conversation.class);







    }

}

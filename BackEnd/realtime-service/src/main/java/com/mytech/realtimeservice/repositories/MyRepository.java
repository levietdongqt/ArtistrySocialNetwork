package com.mytech.realtimeservice.repositories;


import com.mytech.realtimeservice.dto.ConversationDTO;
import com.mytech.realtimeservice.models.Conversation;
import com.mytech.realtimeservice.models.Post;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.jar.Attributes;
import java.util.stream.Collectors;

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

    public List<Post> getPostsAndTrendingWithoutDuplicates(List<String> friendsIds, Set<String> reportedPostIds, int limit, int pageIndex) {
        Sort defaultSort = Sort.by(Sort.Direction.DESC, "createdAt")
                .and(Sort.by(Sort.Direction.DESC, "engagementScore"));
        Sort trendingSort = Sort.by(Sort.Direction.DESC, "priorityScore");
        long skip = (long) pageIndex * limit;
        List<Post> posts = new ArrayList<>();
        Set<String> fetchedPostIds = new HashSet<>(); // Chứa ID các bài viết đã lấy
        // Fetching latest posts from user friends
        Criteria criteriaForUserPosts = new Criteria("userId").in(friendsIds)
                .and("id").nin(reportedPostIds);
        Aggregation userPostsAggregation = Aggregation.newAggregation(
                Aggregation.match(criteriaForUserPosts),
                Aggregation.sort(defaultSort),
                Aggregation.skip(skip),
                Aggregation.limit(limit)
        );
        AggregationResults<Post> userPostsResults = mongoTemplate.aggregate(userPostsAggregation, Post.class, Post.class);
        List<Post> latestPosts = userPostsResults.getMappedResults();
        posts.addAll(latestPosts);
        Aggregation userPostsOld = Aggregation.newAggregation(
                Aggregation.match(criteriaForUserPosts),
                Aggregation.sort(defaultSort)
        );
        AggregationResults<Post> userPostsOldResults = mongoTemplate.aggregate(userPostsOld, Post.class, Post.class);
        List<Post> latestPostsOld = userPostsOldResults.getMappedResults();
        Set<String> latestPostIds = new HashSet<>();
        latestPostsOld.forEach(post -> latestPostIds.add(post.getId()));
        // Lưu ID của các bài viết đã lấy
        latestPosts.forEach(post -> fetchedPostIds.add(post.getId()));
        // Fetching trending posts without duplicates
        Criteria criteriaForTrendingPosts = new Criteria("priorityScore").gt(0)
                .and("id").nin(fetchedPostIds);
        Aggregation trendingPostsAggregation = Aggregation.newAggregation(
                Aggregation.match(criteriaForTrendingPosts),
                Aggregation.sort(trendingSort),
                Aggregation.skip(skip),
                Aggregation.limit(limit)
        );
        AggregationResults<Post> trendingPostsResults = mongoTemplate.aggregate(trendingPostsAggregation, Post.class, Post.class);
        List<Post> trendingPosts = trendingPostsResults.getMappedResults();
        for (Post post : trendingPosts) {
            if (!latestPostIds.contains(post.getId())) {
                posts.add(post);
                fetchedPostIds.add(post.getId());
            }
        }
        return posts;
    }
}

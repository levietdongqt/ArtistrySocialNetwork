package com.mytech.realtimeservice.repositories;

import com.mytech.realtimeservice.models.elasticsearch.PostELS;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostELSRepository extends ElasticsearchRepository<PostELS,String> {

    @Query("{\"match\": {\"content\": {\"query\": \"?0\"}}}")
    List<PostELS> findByContent(String query);
}

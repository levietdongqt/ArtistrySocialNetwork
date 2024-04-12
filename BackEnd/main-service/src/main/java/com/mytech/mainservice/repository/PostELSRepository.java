package com.mytech.mainservice.repository;


import com.mytech.mainservice.model.elasticsearch.PostELS;
import com.mytech.mainservice.model.elasticsearch.UserELS;
import org.springframework.data.elasticsearch.annotations.Query;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostELSRepository extends ElasticsearchRepository<PostELS,String> {

    @Query("{\"multi_match\": {\"query\": \"?0\", \"fields\": [\"content\",\"full_name\"], \"fuzziness\": \"1\"}}")
    public List<PostELS> getPostELS(String search);
}

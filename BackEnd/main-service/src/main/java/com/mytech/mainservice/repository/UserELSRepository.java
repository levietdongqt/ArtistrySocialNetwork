package com.mytech.mainservice.repository;

import com.mytech.mainservice.model.elasticsearch.UserELS;
import org.springframework.data.elasticsearch.annotations.Query;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserELSRepository extends ElasticsearchRepository<UserELS,String> {

    @Query("{\"multi_match\": {\"query\": \"?0\", \"fields\": [\"full_name\",\"roles\",\"email\"], \"fuzziness\": \"1\"}}")
    public List<UserELS> getUserELS(String search);
}

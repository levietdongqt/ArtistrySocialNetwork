package com.mytech.mainservice.repository;

import com.mytech.mainservice.model.elasticsearch.ServiceELS;
import com.mytech.mainservice.model.elasticsearch.UserELS;
import org.springframework.data.elasticsearch.annotations.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceELSRepository extends ElasticsearchRepository<ServiceELS,Long> {
    @Query("{\"multi_match\": {\"query\": \"?0\", \"fields\": [\"name\",\"description\"], \"fuzziness\": \"1\"}}")
    public List<ServiceELS> getServiceELS(String search);
}

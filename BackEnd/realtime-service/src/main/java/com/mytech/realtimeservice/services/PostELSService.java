package com.mytech.realtimeservice.services;

import com.mytech.realtimeservice.models.elasticsearch.PostELS;
import com.mytech.realtimeservice.repositories.PostELSRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class PostELSService {

    @Autowired
    private PostELSRepository postELSRepository;

    public List<PostELS> testPostELS(String search) {
        var hits = postELSRepository.findByContent(search);
        return hits;
    }
}

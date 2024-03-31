package com.mytech.realtimeservice.controller;

import com.mytech.realtimeservice.dto.ResponseObject;
import com.mytech.realtimeservice.models.Post;
import com.mytech.realtimeservice.services.PostService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/posts")
@Slf4j
public class PostController {

    @Autowired
    private PostService postService;


    @GetMapping
    public ResponseEntity<?> getPostList() {
        List<Post> posts = postService.findAll();
        log.info("PostList",posts);
        return ResponseEntity.status(HttpStatus.OK).body(
                ResponseObject.builder()
                        .status(HttpStatus.CREATED)
                        .message("Get post list OK")
                        .data(posts)
                        .build()
        );
    }

}

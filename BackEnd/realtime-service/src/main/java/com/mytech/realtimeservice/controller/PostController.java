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
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/posts")
@Slf4j
public class PostController {

    @Autowired
    private PostService postService;

    @GetMapping("/get-posts")
    public ResponseEntity<?> getPostList(@RequestParam("limit") int limit) {
        log.info("PostList ",postService.findAll(limit));
        return ResponseEntity.status(HttpStatus.OK).body(
                ResponseObject.builder()
                        .status(HttpStatus.CREATED)
                        .message("Get post list limit " + limit  + " OK")
                        .data(postService.findAll(limit))
                        .build()
        );
    }
    @GetMapping("/get-posts/count")
    public ResponseEntity<?> countPostList () {
        log.info("PostList ",postService.count());
        return ResponseEntity.status(HttpStatus.OK).body(
                ResponseObject.builder()
                        .status(HttpStatus.CREATED)
                        .message("Get post list count OK")
                        .data(postService.count())
                        .build()
        );
    }

}

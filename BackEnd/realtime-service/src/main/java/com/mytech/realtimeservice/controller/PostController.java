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
    public ResponseEntity<?> getPostList() {
        log.info("PostList ",postService.findAll());
        return ResponseEntity.status(HttpStatus.OK).body(
                ResponseObject.builder()
                        .status(HttpStatus.CREATED)
                        .message("Get post list limit "  + " OK")
                        .data(postService.findAll())
                        .build()
        );
    }

}

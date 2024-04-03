package com.mytech.realtimeservice.controller;

import com.mytech.realtimeservice.dto.*;
import com.mytech.realtimeservice.models.Comments;
import com.mytech.realtimeservice.models.Post;
import com.mytech.realtimeservice.services.CommentsService;
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

    @Autowired
    private CommentsService commentsService;


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
        log.info("PostList ",postService.getCountPost());
        return ResponseEntity.status(HttpStatus.OK).body(
                ResponseObject.builder()
                        .status(HttpStatus.CREATED)
                        .message("Get post list count OK")
                        .data(postService.getCountPost())
                        .build()
        );
    }

    @PostMapping
    public ResponseEntity<?> savePost(@RequestBody PostDTO postDTO) {
        Post savedPost = postService.create(postDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ResponseObject.builder()
                        .status(HttpStatus.CREATED)
                        .message("Get post list OK")
                        .data(savedPost)
                        .build()
        );
    }

    @PostMapping("/likes")
    public ResponseEntity<?> createPostLike(@RequestBody PostLikeDTO postLikeDTO){
        Post post = postService.createPostLike(postLikeDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ResponseObject.builder()
                        .status(HttpStatus.CREATED)
                        .message("Handler likes successfully, likes: " + post.getTotalLikes())
                        .data(post)
                        .build()
        );
    }

    @PostMapping("/comments")
    public ResponseEntity<?> createComment(@RequestBody CommentDTO commentDTO) {
        Comments comments = commentsService.createComments(commentDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ResponseObject.builder()
                        .status(HttpStatus.CREATED)
                        .message("Create comments successfully")
                        .data(comments)
                        .build()
        );
    }

    @PostMapping("/comments/likes")
    public ResponseEntity<?> createCommentLike(@RequestBody CommentLikeDTO commentLikeDTO){
        Comments comments = commentsService.createCommentLike(commentLikeDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ResponseObject.builder()
                        .status(HttpStatus.CREATED)
                        .message("Handler likes successfully, likes: " + comments.getTotalLikes())
                        .data(comments)
                        .build()
        );
    }

}

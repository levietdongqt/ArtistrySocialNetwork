package com.mytech.realtimeservice.controller;

import com.mytech.realtimeservice.dto.*;
import com.mytech.realtimeservice.models.Comments;
import com.mytech.realtimeservice.models.Post;
import com.mytech.realtimeservice.repositories.MyRepository;
import com.mytech.realtimeservice.services.*;
import com.netflix.eventbus.spi.Subscribe;
import jakarta.ws.rs.PathParam;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/posts")
@Slf4j
public class PostController {


    @Autowired
    private final SimpMessagingTemplate messagingTemplate;
    @Autowired
    private IPostService postService;

    @Autowired
    private ICommentsService commentsService;

    @Autowired
    private MyRepository myRepository;

    @Autowired
    private IWSSocket socket;

    @PreAuthorize("@jwtTokenHolder.isValidUserId(#userId)")
    @GetMapping("/get-posts/{userId}")
    public ResponseEntity<?> getPostList(@PathVariable String userId,@RequestParam("limit") int limit,@RequestParam("pageIndex") int pageIndex) {
            log.info("Post List ");
        return ResponseEntity.status(HttpStatus.OK).body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Get post list limit " + limit + " va offset " + pageIndex + " OK")
                        .data(postService.findAll(limit,pageIndex,userId))
                        .build()
        );
    }


    @GetMapping("/get-posts-byid/{userId}")
    public ResponseEntity<?> getPostListById(@PathVariable String userId,@RequestParam("limit") int limit,@RequestParam("pageIndex") int pageIndex) {
        log.info("Post List ");
        return ResponseEntity.status(HttpStatus.OK).body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Get post list limit " + limit + " va offset " + pageIndex + " OK")
                        .data(postService.findAllById(limit,pageIndex,userId))
                        .build()
        );
    }

    @PreAuthorize("@jwtTokenHolder.isValidUserId(#userId)")
    @GetMapping("/get-posts-pag/{userId}")
    public ResponseEntity<?> getPostListNotPag(@PathVariable String userId) {
        log.info("Post List ");
        return ResponseEntity.status(HttpStatus.OK).body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Get post list not pag OK")
                        .data(postService.findAllNotPag(userId))
                        .build()
        );
    }

    @GetMapping("/getTotalLike/{postId}")
    public ResponseEntity<?> getTotalLikePostByPostId(@PathVariable String postId){
        log.info("total like Post get by id " + postId);
        return ResponseEntity.status(HttpStatus.OK).body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Get post list OK")
                        .data(postService.showTotalLikesByPostId(postId))
                        .build()
        );
    }
    @GetMapping("/get-post/{postId}")
    public ResponseEntity<?> getPostById(@PathVariable String postId) {
        log.info("Post get by id " + postId);
        return ResponseEntity.status(HttpStatus.OK).body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Get post list OK")
                        .data(postService.getPostById(postId))
                        .build()
        );
    }
    @GetMapping("/count")
    public ResponseEntity<?> countPostList () {
        log.info("post count ");
        return ResponseEntity.status(HttpStatus.OK).body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Get post list count OK")
                        .data(postService.getCountPost())
                        .build()
        );
    }
//    @DeleteMapping("/deleteAll")
//    public ResponseEntity<?> deleteAllPostList () {
//        log.info("delete All post");
//        postService.deleteAll();
//        return ResponseEntity.status(HttpStatus.OK).body(
//                ResponseObject.builder()
//                        .status(HttpStatus.OK)
//                        .message("Delete all post is OK")
//                        .data( "success")
//                        .build()
//        );
//    }
    @DeleteMapping("/deleteById/{postId}")
    public ResponseEntity<?> deleteByIdPost (@PathVariable String postId) {
        log.info("delete post by id");
        return ResponseEntity.status(HttpStatus.OK).body(
                ResponseObject.builder()
                        .status(HttpStatus.CREATED)
                        .message("Delete post id is OK")
                        .data(postService.deletePost(postId) ? "success" : "fail")
                        .build()
        );
    }

    @PreAuthorize("@jwtTokenHolder.isValidUserId(#postDTO.sendUserId) && hasRole('USER')")
    @PostMapping("/post-create")
    public ResponseEntity<?> savePost(@RequestBody PostDTO postDTO) {
        log.info("post create ",postService.getCountPost());
        PostResponse savedPost = postService.create(postDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ResponseObject.builder()
                        .status(HttpStatus.CREATED)
                        .message("Get post list OK")
                        .data(savedPost)
                        .build()
        );
    }

    @GetMapping("/postIds")
    public ResponseEntity<?> getPostIds(@RequestParam List<String> ids){
        List<PostResponse> responses = postService.findPostByIdInList(ids);
        return ResponseEntity.status(HttpStatus.OK).body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Handler list post successfully,")
                        .data(responses)
                        .build()
        );
    }

    @PreAuthorize("@jwtTokenHolder.isValidUserId(#postLikeDTO.byUser.id) && hasRole('USER')")
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


    @GetMapping("/comments/{PostId}")
    public ResponseEntity<?> getPostComments(@PathVariable String PostId) {
        List<Comments> comments = commentsService.getCommentsByPostId(PostId);
        log.info("Get comments list by post id: " + PostId);
        return ResponseEntity.status(HttpStatus.OK).body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Get comments list by post id: " + PostId)
                        .data(comments)
                        .build()
        );
    }

    @GetMapping("/commentsParentId/{commentParentId}")
    public ResponseEntity<?> getCommentsParent(@PathVariable String commentParentId) {
        List<Comments> comments = commentsService.getCommentsByParentCommentId(commentParentId);
        log.info("Get comments list by post id: " + commentParentId);
        return ResponseEntity.status(HttpStatus.OK).body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Get comments parent list by post id: " + commentParentId)
                        .data(comments)
                        .build()
        );
    }

    @GetMapping("/commentsParentIdCount/{commentParentId}")
    public ResponseEntity<?> getCommentsParentCount(@PathVariable String commentParentId) {
        Long comments = commentsService.countCommentsParentId(commentParentId);
        log.info("Get comments list by post id: " + commentParentId);
        return ResponseEntity.status(HttpStatus.OK).body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Get comments parent list by commentParent id: " + commentParentId)
                        .data(comments)
                        .build()
        );
    }


    @PreAuthorize("@jwtTokenHolder.isValidUserId(#commentDTO.byUser.id) && hasRole('USER')")
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


    @DeleteMapping("/comments/delete/{commentId}")
    public ResponseEntity<?> deleteCommentById(@PathVariable String commentId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ResponseObject.builder()
                        .status(HttpStatus.CREATED)
                        .message("Create comments successfully")
                        .data(commentsService.deleteCommentById(commentId) ? "success" : "fail")
                        .build());
    }

    @PreAuthorize("@jwtTokenHolder.isValidUserId(#commentLikeDTO.byUser.id) && hasRole('USER')")
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

    @PostMapping("/search-posts")
    public ResponseEntity<?> searchPost(@RequestBody List<String> listIds){
        List<PostResponse> posts = postService.searchPost(listIds);
        return ResponseEntity.status(HttpStatus.OK).body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Get post list OK")
                        .data(posts)
                        .build()
        );
    }

    @PostMapping("/updates-users")
    public ResponseEntity<?> updateUserForRealtime(@RequestBody UserDTO userDTO){
        myRepository.updateUserInRealTime(userDTO);
        return ResponseEntity.status(HttpStatus.OK).body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Get post list OK")
                        .data(null)
                        .build()
        );
    }


}

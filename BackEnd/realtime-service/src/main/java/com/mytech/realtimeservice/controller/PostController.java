package com.mytech.realtimeservice.controller;

import com.mytech.realtimeservice.dto.*;
import com.mytech.realtimeservice.models.Comments;
import com.mytech.realtimeservice.models.Post;
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
    private IWSSocket socket;

    @PreAuthorize("@jwtTokenHolder.isValidUserId(#userId) && hasRole('USER')")
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
    @DeleteMapping("/deleteAll")
    public ResponseEntity<?> deleteAllPostList () {
        log.info("delete All post");
        postService.deleteAll();
        return ResponseEntity.status(HttpStatus.OK).body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Delete all post is OK")
                        .data( "success")
                        .build()
        );
    }
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
        Post savedPost = postService.create(postDTO);
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
        return ResponseEntity.status(HttpStatus.OK).body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Get comments list OK")
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

    @GetMapping("/search-posts")
    public ResponseEntity<?> getPostsByKeyWord(@Param("q") String q){
        List<Post> posts = postService.getPostByKeyWord(q);
        return ResponseEntity.status(HttpStatus.OK).body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Get post list OK")
                        .data(posts)
                        .build()
        );
    }


//    @GetMapping("/suggests")
//    public ResponseEntity<?> searchSuggestPosts(@PathParam("q") String q) {
//        List<PostELS> postELSList = postELSService.testPostELS(q);
//        return ResponseEntity.status(HttpStatus.OK).body(
//                ResponseObject.builder()
//                        .status(HttpStatus.OK)
//                        .message("Handler get successfully")
//                        .data(postELSList)
//                        .build()
//        );
//    }

}

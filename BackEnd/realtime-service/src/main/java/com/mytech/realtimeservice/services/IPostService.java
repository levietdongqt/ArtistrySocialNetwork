package com.mytech.realtimeservice.services;

import com.mytech.realtimeservice.dto.PostDTO;
import com.mytech.realtimeservice.dto.PostLikeDTO;
import com.mytech.realtimeservice.dto.PostResponse;
import com.mytech.realtimeservice.dto.descendingActionDto;
import com.mytech.realtimeservice.models.Post;
import com.mytech.realtimeservice.models.users.User;

import java.util.List;

public interface IPostService {
    public PostResponse create(PostDTO postDTO);
    List<PostResponse> findAllNotPag(String userId);
    void descreasePriorityScore(descendingActionDto descendingActionDto);
    List<PostResponse> findAll(int limit, int pageIndex, String userId);
    public boolean deleteAll();
    public Post findById(String id);
    PostResponse showTotalLikesByPostId(String postId);
    public Post updateLikeForPost(String postId, User userLike);

    public Post updateDislikeForPost(String postId,User userLike);

    public Post createPostLike(PostLikeDTO postLikeDTO);
    public Post updateCommentsForPost(String postId);
    List<PostResponse> findPostByIdInList(List<String> postIds);
    Boolean deletePost(String postId);
    Post getPostById(String postId);
    long getCountPost();



    public List<PostResponse> searchPost(List<String> listIds);
}

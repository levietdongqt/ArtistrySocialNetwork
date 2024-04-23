package com.mytech.realtimeservice.services;

import com.mytech.realtimeservice.dto.PostDTO;
import com.mytech.realtimeservice.dto.PostLikeDTO;
import com.mytech.realtimeservice.dto.PostResponse;
import com.mytech.realtimeservice.models.Post;
import com.mytech.realtimeservice.models.users.User;

import java.util.List;

public interface IPostService {
    public Post create(PostDTO postDTO);

    public List<PostResponse> findAll(int limit, int offset);
    public boolean deleteAll();
    public Post findById(String id);

    public Post updateLikeForPost(String postId, User userLike);

    public Post updateDislikeForPost(String postId,User userLike);

    public Post createPostLike(PostLikeDTO postLikeDTO);
    public Post updateCommentsForPost(String postId);

    public List<PostResponse> searchPost(List<String> listIds);
}

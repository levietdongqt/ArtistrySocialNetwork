package com.mytech.realtimeservice.services;

import com.mytech.realtimeservice.dto.PostResponse;
import com.mytech.realtimeservice.models.Post;
import com.mytech.realtimeservice.models.users.User;
import com.mytech.realtimeservice.repositories.PostRepository;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private ModelMapper modelMapper;

    public Post create(Post post) {
        User userPost1 = User.builder().userId("user1").userName("user2").avatar("ssssssss").build();
        User userTag2 = User.builder().userId("user2").userName("user2").avatar("sssssưss").build();
        User userTag3 = User.builder().userId("user3").userName("user3").avatar("ssssdssss").build();
        User userTag4 = User.builder().userId("user4").userName("user4").avatar("ssssws").build();
        List<User> userTags = new ArrayList<User>();
        userTags.add(userTag2);
        userTags.add(userTag3);
        userTags.add(userTag4);

        post.setTagUserPosts(userTags);
        post.setUser(userPost1);
        post.setCreatedBy(userPost1.getUserId());
        return postRepository.save(post);
    }
    public List<PostResponse> findAll(int limit) {
        Sort sort = Sort.by(Sort.Direction.DESC,"createdAt");
        Pageable pageable = PageRequest.of(0, limit, sort);
        List<Post> posts = postRepository.findByOrderByCreatedAtDesc(pageable);
        List<PostResponse> postResponses = new ArrayList<>();
        postResponses = modelMapper.map(posts,postResponses.getClass());
        return postResponses;
    }

    public long count() {
        return postRepository.count();
    }
    public void deleteAll() {
        postRepository.deleteAll();
    }
}

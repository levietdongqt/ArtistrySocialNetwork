package com.mytech.realtimeservice.services;

import com.mytech.realtimeservice.models.Post;
import com.mytech.realtimeservice.models.users.User;
import com.mytech.realtimeservice.repositories.PostRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class PostService {

    @Autowired
    private PostRepository postRepository;

    public Post create(Post post) {
        User userPost1 = User.builder().userId("user1").userName("user2").build();
        User userTag2 = User.builder().userId("user2").userName("user2").build();
        User userTag3 = User.builder().userId("user3").userName("user3").build();
        User userTag4 = User.builder().userId("user4").userName("user4").build();
        List<User> userTags = new ArrayList<User>();
        userTags.add(userTag2);
        userTags.add(userTag3);
        userTags.add(userTag4);

        post.setTagUserPosts(userTags);
        post.setUser(userPost1);
        return postRepository.save(post);
    }
    public List<Post> findAll() {
        return postRepository.findAll();
    }

    public void deleteAll() {
        postRepository.deleteAll();
    }

    public Post findById(String id) {
        return postRepository.findById(id).get();
    }

}

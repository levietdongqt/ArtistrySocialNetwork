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
        User userPost1 = User.builder().userId("user1").build();
        UserTag userTag2 = UserTag.builder().userId("user2").name("user2").build();
        UserTag userTag3 = UserTag.builder().userId("user3").name("user3").build();
        UserTag userTag4 = UserTag.builder().userId("user4").name("user4").build();
        List<UserTag> userTags = new ArrayList<UserTag>();
        userTags.add(userTag2);
        userTags.add(userTag3);
        userTags.add(userTag4);

        post.setTagUserPosts(userTags);
        post.setUserPost(userPost1);
        return postRepository.save(post);
    }
}

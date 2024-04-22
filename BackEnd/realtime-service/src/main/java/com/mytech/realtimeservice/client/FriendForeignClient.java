package com.mytech.realtimeservice.client;

import com.mytech.realtimeservice.dto.PostELS;
import com.mytech.realtimeservice.dto.ResponseObject;
import com.mytech.realtimeservice.dto.UserDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient (name="MAIN-SERVICE")
public interface FriendForeignClient {
    @GetMapping("/api/main/friends/{userId}")
    public ResponseObject<List<UserDTO>> getFriends( @PathVariable String userId);

    @PostMapping("/api/main/elasticsearch/posts")
    public ResponseEntity<?> savePostELS(@RequestBody PostELS postELS);


    @DeleteMapping("/api/main/elasticsearch/posts/{id}")
    public ResponseEntity<?> deletePostELS(@PathVariable String id);
}

package com.mytech.realtimeservice.client;

import com.mytech.realtimeservice.dto.ResponseObject;
import com.mytech.realtimeservice.dto.UserDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient (name="MAIN-SERVICE")
public interface FriendForeignClient {
    @GetMapping("/api/main/friends/{userId}")
    public ResponseObject<List<UserDTO>> getFriends(@PathVariable String userId);
}

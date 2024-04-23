package com.mytech.mainservice.controller;

import com.mytech.mainservice.dto.ResponseObject;
import com.mytech.mainservice.model.elasticsearch.PostELS;
import com.mytech.mainservice.service.IELSService;
import com.mytech.mainservice.service.IFriendService;
import com.mytech.mainservice.service.IUserService;
import com.mytech.mainservice.service.implement.ELSService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/elasticsearch")
public class ElasticController {

    @Autowired
    private IELSService elsService;

    @Autowired
    private IUserService userService;

    @Autowired
    private IFriendService friendService;

    @PostMapping("/posts")
    public ResponseEntity<?> savePostELS(@RequestBody PostELS postELS){
        elsService.savePostELS(postELS);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Tạo postELS thành công")
                        .data(null)
                        .build()
        );
    }
    @DeleteMapping("/posts/{id}")
    public ResponseEntity<?> deletePostELS(@PathVariable String id){
        elsService.deletePostELSById(id);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Delete postELS thành công")
                        .data(null)
                        .build()
        );
    }

    @GetMapping()
    public ResponseEntity<?> suggestKeyword(@Param("q") String q){
        var result = elsService.suggestsKeyword(q);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Search postELS thành công")
                        .data(result)
                        .build());
    }

    @PreAuthorize("@jwtTokenHolder.isValidUserId(#userId) && hasRole('USER')")
    @PutMapping("/{userId}/update-history")
    public ResponseEntity<?> updateHistory(@PathVariable String userId,@RequestBody String searchText){
        userService.updateHistorySearch(userId,searchText);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ResponseObject.builder()
                        .status(HttpStatus.CREATED)
                        .message("Update History OK")
                        .data(null)
                        .build());
    }
    @PreAuthorize("@jwtTokenHolder.isValidUserId(#userId) && hasRole('USER')")
    @GetMapping("/{userId}/get-history")
    public ResponseEntity<?> getHistorySearch(@PathVariable String userId) {
        var results = userService.getHistorySearch(userId);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Get History Search OK")
                        .data(results)
                        .build());
    }
    @PreAuthorize("@jwtTokenHolder.isValidUserId(#userId) && hasRole('USER')")
    @PostMapping("/{userId}/get-users")
    public ResponseEntity<?> getUserSearch(@PathVariable String userId,@RequestBody List<String> listIds) {
        var results = friendService.searchFriend(userId,listIds);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Get User Search OK")
                        .data(results)
                        .build());
    }

    @PostMapping("/get-services")
    public ResponseEntity<?> getServiceSearch(@RequestBody List<Long> listIds) {
        var results = elsService.searchMainServiceByKeyword(listIds);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Get Service Search OK")
                        .data(results)
                        .build());
    }

    @PreAuthorize("@jwtTokenHolder.isValidUserId(#userId) && hasRole('USER')")
    @PostMapping("/{userId}/delete-history")
    public ResponseEntity<?> deleteHistory(@PathVariable String userId,@RequestBody String history) {
        userService.deleteHistory(userId,history);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Delete History OK")
                        .data(null)
                        .build());
    }

    @PreAuthorize("@jwtTokenHolder.isValidUserId(#userId) && hasRole('USER')")
    @PostMapping("/{userId}/delete-all-history")
    public ResponseEntity<?> deleteAllHistory(@PathVariable String userId) {
        userService.deleteAllHistory(userId);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Delete All History OK")
                        .data(null)
                        .build());
    }




}

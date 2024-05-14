package com.mytech.realtimeservice.controller;

import com.mytech.realtimeservice.dto.BookmarkDTO;
import com.mytech.realtimeservice.dto.ResponseObject;
import com.mytech.realtimeservice.services.IBookmarksService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Slf4j
@RequestMapping("/bookmark")
public class BookmarkController {

    @Autowired
    private IBookmarksService bookmarksService;

    @PreAuthorize("@jwtTokenHolder.isValidUserId(#userId)&& hasRole('USER')")
    @GetMapping("/{userId}")
    public ResponseEntity<?> getBookmarksByUserId(@PathVariable String userId) {
        List<BookmarkDTO> bookmarks = bookmarksService.getBookmarksByUserId(userId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(
                        ResponseObject.builder()
                                .status(HttpStatus.OK)
                                .message("Handle get bookmarks by " + userId)
                                .data(bookmarks)
                                .build()
                );
    }

    @PreAuthorize("@jwtTokenHolder.isValidUserId(#userId) && hasRole('USER')")
    @DeleteMapping("/deleteBookmarksById/{postId}/{userId}")
    public ResponseEntity<?> deleteBookmarkByUserIdAndPostId(@PathVariable String postId,@PathVariable String userId) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(
                        ResponseObject.builder()
                                .status(HttpStatus.OK)
                                .message("Handle create bookmark")
                                .data(bookmarksService.deleteBookmark(postId,userId) ? "success" : "fail")
                                .build()
                );
    }

    @PreAuthorize("@jwtTokenHolder.isValidUserId(#userId) && hasRole('USER')")
    @DeleteMapping("/deleteBookmarksAll/{userId}")
    public ResponseEntity<?> deleteAllBookmarks(@PathVariable String userId) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(
                        ResponseObject.builder()
                                .status(HttpStatus.CREATED)
                                .message("Handle create bookmark")
                                .data(bookmarksService.deleteAllBookmarks(userId) ? "success" : "fail")
                                .build()
                );
    }
    @PreAuthorize("@jwtTokenHolder.isValidUserId(#bookmarkDTO.userId) && hasRole('USER')")
    @PostMapping("/create-Bookmark")
    public ResponseEntity<?> createBookmark(@RequestBody BookmarkDTO bookmarkDTO) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(
                        ResponseObject.builder()
                                .status(HttpStatus.CREATED)
                                .message("Handle create bookmark")
                                .data(bookmarksService.createOrDeleteBookmark(bookmarkDTO))
                                .build()
                );

    }

}


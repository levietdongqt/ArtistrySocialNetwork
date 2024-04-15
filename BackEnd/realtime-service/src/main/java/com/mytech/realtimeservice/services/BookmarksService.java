package com.mytech.realtimeservice.services;

import com.mytech.realtimeservice.dto.BookmarkDTO;
import com.mytech.realtimeservice.dto.BookmarkResponse;
import com.mytech.realtimeservice.models.BookMarks;
import com.mytech.realtimeservice.repositories.BookmarksRepository;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@Service
@Slf4j
public class BookmarksService {

    @Autowired
    private BookmarksRepository bookmarkRepository;

    @Autowired
    private ModelMapper modelMapper;
    public List<BookmarkResponse> getBookmarksByUserId(String userId) {
        List<BookMarks> bookmarks = bookmarkRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return Collections.singletonList(modelMapper.map(bookmarks, BookmarkResponse.class));
    }


    public BookmarkDTO createBookmarks(String postId, String userId) {
            BookMarks bookMarks = BookMarks.builder().postId(postId).userId(userId).createdAt(LocalDateTime.now()).build();
            return modelMapper.map(bookmarkRepository.save(bookMarks), BookmarkDTO.class);
    }

}

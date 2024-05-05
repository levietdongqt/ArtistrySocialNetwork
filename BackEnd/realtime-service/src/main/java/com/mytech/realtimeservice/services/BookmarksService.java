package com.mytech.realtimeservice.services;

import com.mytech.realtimeservice.dto.BookmarkDTO;
import com.mytech.realtimeservice.models.BookMarks;
import com.mytech.realtimeservice.repositories.BookmarksRepository;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
public class BookmarksService implements IBookmarksService {

    @Autowired
    private BookmarksRepository bookmarkRepository;

    @Autowired
    private ModelMapper modelMapper;
    public List<BookmarkDTO> getBookmarksByUserId(String userId) {
        List<BookMarks> bookmarks = bookmarkRepository.findByUserIdOrderByCreatedAtDesc(userId);
        if(bookmarks.isEmpty()){
            return Collections.emptyList();
        }
        return bookmarks.stream()
                .map(bookmark -> modelMapper.map(bookmark, BookmarkDTO.class))
                .collect(Collectors.toList());
    }

    public Boolean deleteAllBookmarks(String userId) {
        List<BookMarks> bookmarks = bookmarkRepository.findBookMarksByUserId(userId);
        if (bookmarks.isEmpty()) {
            return false;
        }
        bookmarkRepository.deleteAll(bookmarks);
        return true;
    }
    public BookmarkDTO createOrDeleteBookmark(BookmarkDTO bookmarkDTO) {
        // Kiểm tra xem bookmark đã tồn tại chưa
        Optional<BookMarks> existingBookmark = bookmarkRepository.findByPostIdAndUserId(bookmarkDTO.getPostId(),bookmarkDTO.getUserId());
        if (existingBookmark.isPresent()) {
            BookMarks bookmark = existingBookmark.get();
            bookmarkRepository.delete(bookmark);
            log.info("Bookmark deleted for postId: {} and userId: {}", bookmarkDTO.getPostId(), bookmarkDTO.getUserId());
            return null;
        } else {
            BookMarks bookMarks = BookMarks.builder()
                    .postId(bookmarkDTO.getPostId())
                    .userId(bookmarkDTO.getUserId())
                    .createdAt(LocalDateTime.now())
                    .build();
            BookMarks savedBookmark = bookmarkRepository.save(bookMarks);
            log.info("Bookmark created successfully for postId: {} and userId: {}", bookmarkDTO.getPostId(), bookmarkDTO.getUserId());
            return modelMapper.map(savedBookmark, BookmarkDTO.class);
        }
    }

}

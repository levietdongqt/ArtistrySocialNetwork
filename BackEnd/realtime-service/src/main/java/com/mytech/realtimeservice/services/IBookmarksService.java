package com.mytech.realtimeservice.services;

import com.mytech.realtimeservice.dto.BookmarkDTO;

import java.util.List;

public interface IBookmarksService {
    List<BookmarkDTO> getBookmarksByUserId(String userId);
    BookmarkDTO createOrDeleteBookmark(BookmarkDTO bookmarkDTO);

    Boolean deleteAllBookmarks(String userId);
}

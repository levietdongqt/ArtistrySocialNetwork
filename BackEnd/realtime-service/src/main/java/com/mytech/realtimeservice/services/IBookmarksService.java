package com.mytech.realtimeservice.services;

import com.mytech.realtimeservice.dto.BookmarkDTO;

import java.util.List;

public interface IBookmarksService {
    List<BookmarkDTO> getBookmarksByUserId(String userId,int limit, int pageIndex);
    BookmarkDTO createOrDeleteBookmark(BookmarkDTO bookmarkDTO);
    Boolean deleteBookmark(String postId, String userId);
    Boolean deleteAllBookmarks(String userId);
}

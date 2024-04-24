package com.mytech.realtimeservice.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document("bookmarks")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BookMarks {
    @Id
    private String id;
    private String postId;
    private String userId;
    private LocalDateTime createdAt;
}

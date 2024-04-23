package com.mytech.realtimeservice.models;

import com.mytech.realtimeservice.enums.ReportStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Report {
    @Id
    private String id;
    private String userId;
    private String title;
    private String postId;
    private String content;
    private ReportStatus status;
    private LocalDateTime createAt;
}

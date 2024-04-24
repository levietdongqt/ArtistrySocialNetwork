package com.mytech.realtimeservice.dto;

import com.mytech.realtimeservice.enums.ReportStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReportDTO {
    private String id;
    private String userId;
    private String title;
    private String postId;
    private String content;
    private ReportStatus status;
    private LocalDateTime createAt;
}

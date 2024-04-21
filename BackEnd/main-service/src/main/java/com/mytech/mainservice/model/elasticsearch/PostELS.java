package com.mytech.mainservice.model.elasticsearch;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(indexName = IndexCreated.INDEX_POST)
public class PostELS {
    @Id
    private String id;
    private String content;
    private String fullName;
    private final String type = "post";
}

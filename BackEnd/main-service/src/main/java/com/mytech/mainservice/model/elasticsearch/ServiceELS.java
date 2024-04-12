package com.mytech.mainservice.model.elasticsearch;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.elasticsearch.annotations.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(indexName = IndexCreated.INDEX_SERVICE)
public class ServiceELS {
    private Long id;
    private String name;
    private String description;
    private final String type = "service";
}

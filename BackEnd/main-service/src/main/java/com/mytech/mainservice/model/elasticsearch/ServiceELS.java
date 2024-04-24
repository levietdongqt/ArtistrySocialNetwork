package com.mytech.mainservice.model.elasticsearch;

import com.mytech.mainservice.dto.ExtraServiceDTO;
import com.mytech.mainservice.dto.PromotionDTO;
import com.mytech.mainservice.dto.UserDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.elasticsearch.annotations.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(indexName = IndexCreated.INDEX_SERVICE)
public class ServiceELS {
    private Long id;
    private String name;
    private String description;
    private String priceType;
    private double price;
    private final String type = "service";
}

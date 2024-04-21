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
    private float duration;
    private float restTime;
    private List<String> imageUrls;
    private String createBy;
    private LocalDateTime createDate;
    private List<ExtraServiceDTO> extraServiceDTOs;
    private PromotionDTO promotionDTO;
    private UserDTO provider;
    private final String type = "service";
}

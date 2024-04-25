package com.mytech.mainservice.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.mytech.mainservice.enums.PromotionType;
import com.mytech.mainservice.model.MainService;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * DTO for {@link com.mytech.mainservice.model.Promotion}
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PromotionDTO implements Serializable {
    private long id;
    private String name;
    private float discountPercent;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String description;
    private PromotionType type;
    private boolean status;
    private UserDTO user;
}
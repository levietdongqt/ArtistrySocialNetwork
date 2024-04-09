package com.mytech.mainservice.dto;

import com.mytech.mainservice.model.MainService;
import lombok.Value;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * DTO for {@link com.mytech.mainservice.model.Promotion}
 */
@Value
public class PromotionDTO implements Serializable {
    long id;
    String name;
    float discountPercent;
    LocalDateTime startDate;
    LocalDateTime endDate;
    String description;
    boolean status;
    List<MainServiceDTO> mainServices;
}
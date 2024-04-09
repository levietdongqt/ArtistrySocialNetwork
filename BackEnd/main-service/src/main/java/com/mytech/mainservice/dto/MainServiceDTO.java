package com.mytech.mainservice.dto;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonSetter;
import com.mytech.mainservice.model.ExtraService;
import com.mytech.mainservice.model.Promotion;
import com.mytech.mainservice.model.User;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Null;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * DTO for {@link com.mytech.mainservice.model.MainService}
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MainServiceDTO implements Serializable {
    private long id;
    private String name;
    private double price;
    private String priceType;
    private float duration;
    private float restTime;
    private List<String> imageUrls;
    private String description;
    private String createBy;
    private LocalDateTime createDate;
    private List<ExtraServiceDTO> extraServiceDTOs;
    private PromotionDTO promotionDTO;
    private UserDTO provider;
}
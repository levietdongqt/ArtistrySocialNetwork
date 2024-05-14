package com.mytech.mainservice.dto;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ExtraServiceDTO implements Serializable {
    private long id;
    private String name;
    private double price;
    private String priceType;
    private String description;
    private List<String> imageUrls;
    private LocalDateTime createDate;
    private String createBy;
    private LocalDateTime updateDate;
    private List<MainServiceDTO> mainServices;
    private PromotionDTO promotionDTO;
    private UserDTO provider;
    private boolean status;
}
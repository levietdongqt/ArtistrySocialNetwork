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
@Value
public class MainServiceDTO implements Serializable {
    long id;
    @Size(max = 100)
    String name;
    double price;
    String priceType;
    float duration;
    float restTime;
    List<String> imageUrls;
    String description;
    String createBy;
    LocalDateTime createDate;
    List<ExtraServiceDTO> extraServiceDTOs = new ArrayList<>();
    PromotionDTO promotionDTO;
    UserDTO provider;
}
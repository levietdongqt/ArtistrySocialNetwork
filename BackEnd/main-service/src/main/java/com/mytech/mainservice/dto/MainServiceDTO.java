package com.mytech.mainservice.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Value;

import java.io.Serializable;
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
    @NotNull
    @Size(max = 20)
    String priceType;
    float duration;
    float restTime;
    List<List<String>> imageUrl;
    String description;
    @Size(max = 50)
    String createBy;
}
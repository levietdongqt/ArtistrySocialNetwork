package com.mytech.mainservice.dto;

import com.mytech.mainservice.model.MainService;
import com.mytech.mainservice.model.User;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Value;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * DTO for {@link com.mytech.mainservice.model.ExtraService}
 */
@Value
public class ExtraServiceDTO implements Serializable {
    long id;
    String name;
    double price;
    String priceType;
    String description;
    boolean status;
    LocalDateTime createDate;
    String createBy;
    LocalDateTime updateDate;
    List<MainServiceDTO> mainServices;;
    UserDTO provider;
}
package com.mytech.mainservice.dto;

import com.mytech.mainservice.dto.MainServiceDTO;
import com.mytech.mainservice.dto.PromotionDTO;
import com.mytech.mainservice.dto.UserDTO;
import com.mytech.mainservice.enums.AccentType;
import com.mytech.mainservice.enums.OrderStatus;
import com.mytech.mainservice.enums.Theme;
import com.mytech.mainservice.enums.UserStatus;
import com.mytech.mainservice.model.Order;
import com.mytech.mainservice.model.User;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Queue;

/**
 * DTO for {@link Order}
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderDto implements Serializable {
    private long id;
    private List<ExtraServiceDTO> additionalService;
    @NotNull
    private LocalDateTime startDate;
    @NotNull
    private LocalDateTime endDate;
    private LocalDateTime createDate;
    private LocalDateTime updateDate;
    @Size(max = 255)
    private String address;
    private OrderStatus status;
    private UserDTO providerUser;
    private UserDTO customerUser;
    private Map<String,Object> metaData;
    private int amount;
    private long totalPrice;
    private MainServiceDTO mainService;
    private PromotionDTO promotion;
}
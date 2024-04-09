package com.mytech.mainservice.dto;

import com.mytech.mainservice.enums.ReviewDetailKey;
import lombok.*;

import java.io.Serializable;
import java.util.Map;

/**
 * DTO for {@link com.mytech.mainservice.model.Review}
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReviewDTO implements Serializable {
    private long id;
    private Map<ReviewDetailKey, Object> reviewDetails;
    private UserDTO customerUser;
    private UserDTO providerUser;
}
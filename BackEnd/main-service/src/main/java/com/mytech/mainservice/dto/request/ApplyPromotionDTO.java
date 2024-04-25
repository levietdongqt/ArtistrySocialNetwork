package com.mytech.mainservice.dto.request;

public record ApplyPromotionDTO(
        String userId,
        long applyId,
        long promotionId
) {
}

package com.mytech.mainservice.dto.request;

import java.time.LocalDateTime;

public record BookingDTO(
        String providerId,
        LocalDateTime bookingDate,
        long promotionId
) {

}

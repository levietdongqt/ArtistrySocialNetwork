package com.mytech.mainservice.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Value;

public record TokenDTO(
        @NotEmpty String token) {
}

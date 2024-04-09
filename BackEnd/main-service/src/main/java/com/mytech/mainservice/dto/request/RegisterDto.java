package com.mytech.mainservice.dto.request;

import com.mytech.mainservice.model.User;
import lombok.*;

import java.util.List;

/**
 * DTO for {@link User}
 */
public record RegisterDto(
        String email,
        String password,
        List<String> roles) {
}
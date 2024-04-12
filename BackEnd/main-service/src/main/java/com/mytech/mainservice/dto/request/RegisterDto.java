package com.mytech.mainservice.dto.request;

import com.mytech.mainservice.enums.UserRole;
import com.mytech.mainservice.model.User;
import lombok.*;

import java.util.List;

/**
 * DTO for {@link User}
 */
public record RegisterDto(
        String fullName,
        String phoneNumber,
        String password,
        List<UserRole> roles) {
}
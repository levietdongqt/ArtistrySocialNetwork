package com.mytech.mainservice.converter;

import com.mytech.mainservice.enums.UserRole;
import com.mytech.mainservice.model.Role;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.Converter;
import org.modelmapper.spi.MappingContext;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
public class UserRoleConverter implements Converter<String, Role> {
    @Override
    public Role convert(MappingContext<String, Role> context) {
        try {
            String source = context.getSource();
            UserRole userRole = UserRole.valueOf(source.toUpperCase());
            return Role.builder().name(userRole).build();
        }catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Role name is not valid");
        }
    }

}

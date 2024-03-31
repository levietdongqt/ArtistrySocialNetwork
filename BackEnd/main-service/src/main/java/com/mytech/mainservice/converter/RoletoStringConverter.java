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
public class RoletoStringConverter implements Converter<Role, String> {
    @Override
    public String convert(MappingContext<Role, String> context) {
        try {
            Role source = context.getSource();
            return source.getName().toString();
        } catch (Exception e) {
            throw new IllegalArgumentException("Role name is not valid");
        }
    }

}

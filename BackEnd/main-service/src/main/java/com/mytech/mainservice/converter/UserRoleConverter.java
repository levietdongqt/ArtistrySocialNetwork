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
public class UserRoleConverter implements Converter<List<String>, List<Role>> {
    @Override
    public List<Role> convert(MappingContext<List<String>, List<Role>> context) {
        List<String> source = context.getSource();
        if (source == null || source.isEmpty()) {
            return null;
        }
        if(Arrays.stream(UserRole.values()).toList().contains(source)){
            throw new IllegalStateException("Role is not valid");
        }
        log.debug("CHECK lại enum contain USER_ROLE_CONVERTER");
        return source.stream().map(
                        item -> Role.builder().name(UserRole.valueOf(item.toUpperCase())).build())
                .collect(Collectors.toList());
    }

}

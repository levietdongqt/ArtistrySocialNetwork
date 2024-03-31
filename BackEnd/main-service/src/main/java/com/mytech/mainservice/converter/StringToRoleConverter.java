package com.mytech.mainservice.converter;

import com.mytech.mainservice.enums.UserRole;
import com.mytech.mainservice.model.Role;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.Converter;
import org.modelmapper.spi.MappingContext;

@Slf4j
public class StringToRoleConverter implements Converter<String, Role> {
    @Override
    public Role convert(MappingContext<String, Role> context) {
        try {
            String source = context.getSource();
            UserRole userRole = UserRole.valueOf(source);
            return Role.builder().name(userRole).build();
        } catch (Exception e) {
            throw new IllegalArgumentException("Role name is not valid");
        }
    }

}

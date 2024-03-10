package com.mytech.mainservice.converter;

import com.mytech.mainservice.enums.UserRole;
import org.modelmapper.Converter;
import org.modelmapper.spi.MappingContext;
import org.springframework.context.annotation.Configuration;


public class UserRoleConverter implements Converter<String, UserRole> {
    @Override
    public UserRole convert(MappingContext <String,UserRole> context) {
        String source = context.getSource();
        if (source == null) {
            return null;
        }
        return UserRole.valueOf(source.toUpperCase());
    }

}

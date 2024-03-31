package com.mytech.realtimeservice.converter;

import com.mytech.realtimeservice.models.feignClient.Role;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.Converter;
import org.modelmapper.spi.MappingContext;

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

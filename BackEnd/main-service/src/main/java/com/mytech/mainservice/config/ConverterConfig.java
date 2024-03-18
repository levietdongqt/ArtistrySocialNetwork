package com.mytech.mainservice.config;

import com.mytech.mainservice.converter.ClaimsTokenConverter;
import com.mytech.mainservice.converter.UserRoleConverter;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ConverterConfig {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.addConverter(new UserRoleConverter());
        modelMapper.addConverter(new ClaimsTokenConverter());
        return modelMapper;
    }
}

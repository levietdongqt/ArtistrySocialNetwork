package com.mytech.realtimeservice.configs;


import com.mytech.realtimeservice.converter.RoletoStringConverter;
import com.mytech.realtimeservice.converter.StringToRoleConverter;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelMapperConfig {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.addConverter(new RoletoStringConverter());
        modelMapper.addConverter(new StringToRoleConverter());
        return modelMapper;
    }
}

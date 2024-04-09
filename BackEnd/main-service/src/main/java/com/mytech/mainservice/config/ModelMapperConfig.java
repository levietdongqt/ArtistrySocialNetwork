package com.mytech.mainservice.config;

import com.mytech.mainservice.converter.ClaimsTokenConverter;
import com.mytech.mainservice.converter.RoletoStringConverter;
import com.mytech.mainservice.converter.StringToRoleConverter;
import org.modelmapper.Condition;
import org.modelmapper.Conditions;
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
        modelMapper.addConverter(new ClaimsTokenConverter());
        modelMapper.getConfiguration().setPropertyCondition(Conditions.isNotNull());
        return modelMapper;
    }
}

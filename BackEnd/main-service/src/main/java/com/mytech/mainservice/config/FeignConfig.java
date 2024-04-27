package com.mytech.mainservice.config;

import com.mytech.mainservice.helper.JwtService;
import com.mytech.mainservice.helper.JwtTokenHolder;
import com.mytech.mainservice.service.implement.AuthService;
import feign.RequestInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.web.context.WebApplicationContext;

@Configuration
public class FeignConfig {
    @Autowired
    private JwtTokenHolder jwtTokenHolder;

    @Bean
    public RequestInterceptor requestInterceptor() {
        return requestTemplate -> {
            // Thêm Authorization header
            requestTemplate.header("Authorization", "Bearer " + jwtTokenHolder.getCurrentToken());
        };
    }
}
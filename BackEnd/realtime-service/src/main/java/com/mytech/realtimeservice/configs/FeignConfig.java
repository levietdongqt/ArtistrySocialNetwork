package com.mytech.realtimeservice.configs;

import com.mytech.realtimeservice.helper.AuthService;
import feign.RequestInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FeignConfig {
    @Autowired
    private AuthService authService;

    @Bean
    public RequestInterceptor requestInterceptor() {
        return requestTemplate -> {
            // Thêm Authorization header
            requestTemplate.header("Authorization", "Bearer " + authService.getAuthToken());
        };
    }
}

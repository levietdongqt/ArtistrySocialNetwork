package com.mytech.mainservice.config;

import com.mytech.mainservice.dto.ResponseObject;
import com.mytech.mainservice.filter.JwtAuthFilter;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.authentication.configuration.EnableGlobalAuthentication;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@Slf4j
public class AuthConfig {
    @Autowired
    private JwtAuthFilter authFilter;

    @Bean
    public UserDetailsService userDetailsService() {
        return new CustomUserDetailService();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http.csrf(AbstractHttpConfigurer::disable)
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(authFilter, UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(authorze -> {
                    authorze
                            .requestMatchers("/auth/**").permitAll()
                            .requestMatchers("/user/**").permitAll()
                            .requestMatchers("/test").permitAll()

                            .requestMatchers("/main-service/get-all/**", "/main-service/get/**").permitAll()
                            .requestMatchers("/extra-service/get-all/**", "/extra-service/get/**").permitAll()
                            .requestMatchers("/hello").authenticated()
                            .anyRequest().authenticated();
                })
                .exceptionHandling(handler -> {
                    handler.authenticationEntryPoint((request, response, authException) -> {
                        log.error(HttpStatus.valueOf(response.getStatus()).toString());
                        log.error(authException.getMessage());
                        response.sendError(response.getStatus());
                        //response.sendRedirect("/api/main/auth/error/true");
                    }).accessDeniedHandler((request, response, accessDeniedException) -> {
                        log.error(accessDeniedException.getMessage());
                        response.sendError(response.getStatus());
                        //response.sendRedirect("/api/main/auth/error/true");
                    });
                });
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setUserDetailsService(userDetailsService());
        authenticationProvider.setPasswordEncoder(passwordEncoder());
        return authenticationProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }
}

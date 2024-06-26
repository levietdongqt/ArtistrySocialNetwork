package com.mytech.realtimeservice.configs;

import com.mytech.realtimeservice.filter.JwtAuthFilter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(securedEnabled = true)
@Slf4j
public class AuthConfig {
    @Autowired
    private JwtAuthFilter authFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // ignore our stomp endpoints since they are protected using Stomp headers
        http.csrf(AbstractHttpConfigurer::disable)
                .addFilterBefore(authFilter, UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(authorze -> {
                    authorze
                            .requestMatchers("/auth/**").permitAll()
                            .requestMatchers("/user/**").permitAll()
                            .requestMatchers("/posts/get-posts").permitAll()
                            .requestMatchers("/socket.io/**").permitAll()
                            .requestMatchers("/auth/hello").authenticated()
                            .anyRequest().authenticated();
                })
                .exceptionHandling(handler -> {
                    handler.authenticationEntryPoint((request, response, authException) -> {
                        log.error("authenticationEntryPoint: " +HttpStatus.valueOf(response.getStatus()).toString());
                        log.error("authenticationEntryPoint: "+  authException.getMessage());
                        response.sendError(HttpStatus.UNAUTHORIZED.value());
                        //response.sendRedirect("/api/main/auth/error/true");
                    }).accessDeniedHandler((request, response, accessDeniedException) -> {
                        log.error("accessDeniedHandler: " + accessDeniedException.getMessage());
                        response.sendError(HttpStatus.FORBIDDEN.value());
                        //response.sendRedirect("/api/main/auth/error/true");
                    });
                });
        return http.build();
    }


}

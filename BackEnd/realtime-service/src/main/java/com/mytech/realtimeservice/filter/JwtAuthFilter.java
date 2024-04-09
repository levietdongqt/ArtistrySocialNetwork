package com.mytech.realtimeservice.filter;


import com.mytech.realtimeservice.configs.CustomUserDetail;
import com.mytech.realtimeservice.helper.AuthService;
import com.mytech.realtimeservice.helper.JwtService;
import com.mytech.realtimeservice.models.feignClient.Role;
import com.mytech.realtimeservice.models.feignClient.User;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {
    @Autowired
    private AuthService authService;
    @Autowired
    private final ModelMapper mapper;
    @Autowired
    private final JwtService jwtService;

    public JwtAuthFilter(JwtService jwtService, ModelMapper mapper) {
        this.jwtService = jwtService;
        this.mapper = mapper;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        var s = request.getServletPath();
       if(request.getServletPath().contains("socket.io")){
           filterChain.doFilter(request, response);
            return;
       }
        String authHeader = request.getHeader("Authorization");
        String token = null;
        String username = null;
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            username = jwtService.extractUsername(token);
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            if (jwtService.validateToken(token)) {
                authService.setAuthToken(token);
                CustomUserDetail userDetails = getUserDetail(token, username);
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        filterChain.doFilter(request, response);
    }

    private CustomUserDetail getUserDetail(String token, String username) {
        try {
            List<String> roleNames = jwtService.extractRoles(token);
            List<Role> roles = roleNames.stream().map(item -> mapper.map(item, Role.class)).toList();
            User user = User.builder()
                    .email(username)
                    .roles(roles)
                    .build();
            return new CustomUserDetail(user);
        } catch (RuntimeException e) {
            logger.error(e.getMessage(), e);
            throw new RuntimeException("ROLE IS NOT FOUND");
        }

    }
}
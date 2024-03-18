package com.mytech.mainservice.filter;

import com.mytech.mainservice.config.CustomUserDetail;
import com.mytech.mainservice.config.CustomUserDetailService;
import com.mytech.mainservice.helper.JwtService;
import com.mytech.mainservice.model.Role;
import com.mytech.mainservice.model.User;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.aspectj.weaver.patterns.IToken;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final ModelMapper mapper;
    private final JwtService jwtService;

    public JwtAuthFilter(JwtService jwtService, ModelMapper mapper) {
        this.jwtService = jwtService;
        this.mapper = mapper;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        String token = null;
        String username = null;
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            username = jwtService.extractUsername(token);
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            if (jwtService.validateToken(token)) {
                CustomUserDetail userDetails = getUserDetail(token, username);
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        filterChain.doFilter(request, response);
    }

    private CustomUserDetail getUserDetail(String token, String username) {
        List<String> roleNames = jwtService.extractRoles(token);
        List<Role> roles = roleNames.stream().map(item -> mapper.map(item,Role.class)).toList();
        User user = User.builder()
                .email(username)
                .roles(roles)
                .build();
        return new CustomUserDetail(user);
    }
}
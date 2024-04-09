package com.mytech.mainservice.filter;

import com.mytech.mainservice.config.CustomUserDetail;
import com.mytech.mainservice.config.CustomUserDetailService;
import com.mytech.mainservice.dto.ResponseObject;
import com.mytech.mainservice.helper.JwtService;
import com.mytech.mainservice.helper.JwtTokenHolder;
import com.mytech.mainservice.model.Role;
import com.mytech.mainservice.model.User;
import com.mytech.mainservice.service.IAuthService;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.aspectj.weaver.patterns.IToken;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
    private final JwtTokenHolder jwtTokenHolder;
    private final RouteValidator routeValidator;

    public JwtAuthFilter(JwtService jwtService, ModelMapper mapper, RouteValidator routeValidator, JwtTokenHolder jwtTokenHolder) {
        this.jwtService = jwtService;
        this.mapper = mapper;
        this.routeValidator = routeValidator;
        this.jwtTokenHolder = jwtTokenHolder;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            String authHeader = request.getHeader("Authorization");
            String token = null;
            String username = null;
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
                username = jwtService.extractUsername(token);
            }
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                if (jwtService.validateToken(token)) {
                    jwtTokenHolder.setCurrentToken(token);
                    CustomUserDetail userDetails = getUserDetail(token, username);
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }


        } catch (ExpiredJwtException e) {
            // Token đã hết hạn, trả về status 401
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token đã hết hạn");
            return; // Dừng xử lý tiếp theo và trả về response ngay lập tức
        }
        filterChain.doFilter(request, response);
    }

    private CustomUserDetail getUserDetail(String token, String username) throws ExpiredJwtException {
        try {
            List<String> roleNames = jwtService.extractRoles(token);
            List<Role> roles = roleNames.stream().map(item -> mapper.map(item, Role.class)).toList();
            User user = User.builder().email(username).roles(roles).build();
            return new CustomUserDetail(user);
        } catch (RuntimeException e) {
            logger.error(e.getMessage(), e);
            throw new RuntimeException("ROLE IS NOT FOUND");
        }
    }
}
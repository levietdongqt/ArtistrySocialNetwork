package com.mytech.mainservice.filter;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.function.Predicate;

@Component
public class RouteValidator {

    // danh sach open api
    public static final List<String> openApiEndpoints = List.of(
            "/auth/refreshToken"
    );

    public Predicate<HttpServletRequest> isSecured =
            request -> openApiEndpoints
                    .stream()
                    .noneMatch(uri -> request.getServletPath().contains(uri));


}

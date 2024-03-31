package com.mytech.gatewayservice.filter;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.function.Predicate;

@Component
public class RouteValidator {

    // danh sach open api
    public static final List<String> openApiEndpoints = List.of(
            "/api/main/auth",
            "/api/main/user/",
            "/api/main/test",
            "/api/main/test/get-runtime",
            "/api/realtime/test1",
            "/eureka"
    );

    public Predicate<ServerHttpRequest> isSecured =
            request -> openApiEndpoints
                    .stream()
                    .noneMatch(uri -> request.getURI().getPath().contains(uri));


}

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
            "/api/main/main-service/get",
            "/api/main/extra-service/get",
            "/api/main/user/",
            "/api/main/test",
            "/api/main/test/get-runtime",
            "/api/realtime/posts/get-posts",
            "/api/realtime/test/",
            "/api/realtime/socket.io/",
            "/socket.io/",
            "/eureka"
    );

    public Predicate<ServerHttpRequest> isSecured =
            request -> openApiEndpoints
                    .stream()
                    .noneMatch(uri -> request.getURI().getPath().contains(uri));


}

package com.mytech.mainservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

@FeignClient (name="REALTIME-SERVICE")
public interface TestClient {
    @GetMapping("/api/realtime/test2")
    public String test1();
    @GetMapping("/test2")
    public String test2();
}

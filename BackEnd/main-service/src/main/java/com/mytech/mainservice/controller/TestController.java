package com.mytech.mainservice.controller;

import com.mytech.mainservice.client.TestClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test")
public class TestController {

    @Autowired
    private TestClient testClient;

    @GetMapping("")
    public String index() {
        return "Hello World from main service";
    }

    @GetMapping("get-runtime")
    public String getFromRuntime() {
        return testClient.test1();
    }

}

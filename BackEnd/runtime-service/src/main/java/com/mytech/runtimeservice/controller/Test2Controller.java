package com.mytech.runtimeservice.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test2")
public class Test2Controller {

    private static final Logger LOGGER = LoggerFactory.getLogger(TestController.class);

    @GetMapping("")
    public String index() {
        LOGGER.info("Logger successfully ");
        return "Hello World from runtime service test 2";
    }
}

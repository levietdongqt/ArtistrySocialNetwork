package com.mytech.mainservice.controller;

import com.mytech.mainservice.dto.MainServiceDTO;
import com.mytech.mainservice.dto.ResponseObject;
import com.mytech.mainservice.service.IMainService2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Set;

@RestController
@RequestMapping("/services")
public class MainServiceController {

    @Autowired
    private IMainService2 mainService2;

    @RequestMapping("/{userId}")
    public ResponseEntity<?> test(@PathVariable("userId") String userId) {
        Set<MainServiceDTO> mainServiceDTOs = mainService2.getMainServices(userId);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Get Service successfully")
                        .data(mainServiceDTOs).build()
        );
    }
}

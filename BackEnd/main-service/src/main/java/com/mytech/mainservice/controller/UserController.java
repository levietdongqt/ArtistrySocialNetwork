package com.mytech.mainservice.controller;

import com.mytech.mainservice.dto.ResponseObject;
import com.mytech.mainservice.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private IUserService userService;

    //Id có trong DB: 05ce9cd0-def3-11ee-b0db-6045bd58a1e3
    //truy cập: http://localhost:8060/api/main/user/get/05ce9cd0-def3-11ee-b0db-6045bd58a1e3
    @GetMapping("/get/{userId}")
    public ResponseEntity<ResponseObject> getUser(@PathVariable("userId") String userId) {
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Get User OK")
                        .data(userService.getUserById(userId))
                        .build());
    }



    //Lấy ID của user trong database
    @GetMapping("/get-random-id")
    public ResponseEntity<ResponseObject> getId() {
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Get test ID OK")
                        .data(userService.getRandomId())
                        .build());
    }
}

package com.mytech.mainservice.controller;

import com.mytech.mainservice.dto.ResponseObject;
import com.mytech.mainservice.dto.WorkingTimeDTO;
import com.mytech.mainservice.service.IBookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/booking")
public class BookingController {

    @Autowired
    private IBookingService bookingService;

    @GetMapping("/get/working-times/{providerId}")
    public ResponseEntity<?> getWorkingTimes(@PathVariable String providerId) {
        List<WorkingTimeDTO> workingTimes = bookingService.getWorkingTimesByProvider(providerId);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ResponseObject.builder()
                        .status(HttpStatus.CREATED)
                        .message("get working day successfully")
                        .data(workingTimes)
                        .build());
    }
}

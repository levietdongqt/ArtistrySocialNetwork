package com.mytech.mainservice.controller;

import com.mytech.mainservice.dto.OrderDto;
import com.mytech.mainservice.dto.ResponseObject;
import com.mytech.mainservice.dto.WorkingTimeDTO;
import com.mytech.mainservice.dto.request.BookingDTO;
import com.mytech.mainservice.service.IBookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/booking")
public class BookingController {

    @Autowired
    private IBookingService bookingService;

    @PreAuthorize("hasRole('USER')")
    @PostMapping("/get/working-times")
    public ResponseEntity<?> getWorkingTimes(@RequestBody BookingDTO bookingDTO) {
        List<WorkingTimeDTO> workingTimes = bookingService.getWorkingTimesByProvider(bookingDTO.providerId());
        return ResponseEntity.status(HttpStatus.OK).body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("get working day successfully")
                        .data(workingTimes)
                        .build());
    }

    @PreAuthorize("hasRole('USER')")
    @PostMapping("/get/orders-by-date")
    public ResponseEntity<?> getOrdersInDay(@RequestBody BookingDTO bookingDTO) {
        List<OrderDto> orderDtos = bookingService.getOrdersInDay(bookingDTO);
        return ResponseEntity.status(HttpStatus.OK).body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("get orders successfully")
                        .data(orderDtos)
                        .build());
    }

    @PreAuthorize("hasRole('USER')")
    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody OrderDto orderDto) {
         bookingService.createOrder(orderDto);
        return ResponseEntity.status(HttpStatus.OK).body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Create Order successfully")
                        .data(null)
                        .build());
    }

    @PreAuthorize("hasRole('PROVIDER')")
    @PostMapping("/get/orders-by-provider")
    public ResponseEntity<?> getByProviderId() {
        List<OrderDto> orderDtos = bookingService.getOrdersByProviderId();
        return ResponseEntity.status(HttpStatus.OK).body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("get orders by provider successfully")
                        .data(orderDtos)
                        .build());
    }
}

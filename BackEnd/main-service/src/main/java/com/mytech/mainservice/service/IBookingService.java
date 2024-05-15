package com.mytech.mainservice.service;

import com.mytech.mainservice.dto.OrderDto;
import com.mytech.mainservice.dto.WorkingTimeDTO;
import com.mytech.mainservice.dto.request.BookingDTO;
import com.mytech.mainservice.model.WorkingTime;

import java.util.List;

public interface IBookingService {
    List<WorkingTimeDTO> getWorkingTimesByProvider(String providerId);

    List<OrderDto> getOrdersInDay(BookingDTO bookingDTO);

    void createOrder(OrderDto orderDto);

    List<OrderDto> getOrdersByProviderId();
}

package com.mytech.mainservice.service.implement;

import com.mytech.mainservice.dto.OrderDto;
import com.mytech.mainservice.dto.WorkingTimeDTO;
import com.mytech.mainservice.dto.request.BookingDTO;
import com.mytech.mainservice.model.Order;
import com.mytech.mainservice.repository.IOrderRepository;
import com.mytech.mainservice.repository.IWorkingTimeRepository;
import com.mytech.mainservice.service.IBookingService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService implements IBookingService {

    @Autowired
    private IWorkingTimeRepository workingTimeRepo;
    @Autowired
    private IOrderRepository orderRepo;
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public List<WorkingTimeDTO> getWorkingTimesByProvider(String providerId) {
        LocalDateTime oneMonthAfterNow = LocalDateTime.now().plusDays(30).withHour(1);
        return workingTimeRepo.findByProviderId(providerId,oneMonthAfterNow).stream()
                .map((element) -> modelMapper.map(element, WorkingTimeDTO.class)).toList();
    }

    @Override
    public List<OrderDto> getOrdersInDay(BookingDTO bookingDTO) {
        List<Order> orders = orderRepo.findByStartDateAndProviderUser_Id(bookingDTO.bookingDate().toLocalDate(), bookingDTO.providerId());
        return orders.stream().map((order) -> modelMapper.map(order,OrderDto.class)).toList();
    }
}

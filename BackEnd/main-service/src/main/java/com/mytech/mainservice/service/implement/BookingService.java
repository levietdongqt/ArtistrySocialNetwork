package com.mytech.mainservice.service.implement;

import com.mytech.mainservice.client.NotificationForeignClient;
import com.mytech.mainservice.dto.NotificationDTO;
import com.mytech.mainservice.dto.OrderDto;
import com.mytech.mainservice.dto.UserDTO;
import com.mytech.mainservice.dto.WorkingTimeDTO;
import com.mytech.mainservice.dto.request.BookingDTO;
import com.mytech.mainservice.enums.OrderStatus;
import com.mytech.mainservice.exception.myException.NotFoundException;
import com.mytech.mainservice.exception.myException.UnAuthenticationException;
import com.mytech.mainservice.helper.JwtTokenHolder;
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
    private JwtTokenHolder jwtTokenHolder;
    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private NotificationForeignClient notificationForeignClient;

    @Override
    public List<WorkingTimeDTO> getWorkingTimesByProvider(String providerId) {
        LocalDateTime oneMonthAfterNow = LocalDateTime.now().plusDays(30).withHour(1);
        return workingTimeRepo.findByProviderId(providerId, oneMonthAfterNow).stream()
                .map((element) -> modelMapper.map(element, WorkingTimeDTO.class)).toList();
    }

    @Override
    public List<OrderDto> getOrdersInDay(BookingDTO bookingDTO) {
        List<Order> orders = orderRepo.findByStartDateAndProviderUser_Id(bookingDTO.bookingDate().toLocalDate(), bookingDTO.providerId());
        return orders.stream().map((order) -> modelMapper.map(order, OrderDto.class)).toList();
    }

    @Override
    public void createOrder(OrderDto orderDto) {
        Order order = modelMapper.map(orderDto, Order.class);
        if (order.getAdditionalService() != null) {
            List<String> extraServiceIds = orderDto.getAdditionalService().stream().map(service -> String.valueOf(service.getId())).toList();
            order.setAdditionalService(extraServiceIds);
        }
        var createdOrder = orderRepo.save(order);

        NotificationDTO notificationDTO1 = NotificationDTO.builder()
                .userFrom(orderDto.getProviderUser())
                .userTo(orderDto.getCustomerUser())
                .notificationType("ORDER")
                .message("đã tạo đơn hàng")
                .link(String.valueOf(createdOrder.getId()))
                .build();
        notificationForeignClient.saveNotification(notificationDTO1);

        NotificationDTO notificationDTO2 = NotificationDTO.builder()
                .userFrom(orderDto.getCustomerUser())
                .userTo(orderDto.getProviderUser())
                .notificationType("ORDER")
                .message("đã tạo đơn hàng thành công")
                .link(String.valueOf(createdOrder.getId()))
                .build();
        notificationForeignClient.saveNotification(notificationDTO2);
    }

    @Override
    public List<OrderDto> getOrdersByProviderId() {
        List<Order> orders = orderRepo.findByProviderUser_IdOrderByCreateDate(jwtTokenHolder.getUserId());
        return orders.stream().map((order) -> modelMapper.map(order, OrderDto.class)).toList();
    }

    @Override
    public void changeOderStatus(long orderId, OrderStatus orderStatus) throws UnAuthenticationException {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Couldn't find order'"));
        if(!order.getProviderUser().getId().equals(jwtTokenHolder.getUserId())){
            throw new UnAuthenticationException("You don't have permission");
        }
        order.setStatus(orderStatus);
        orderRepo.save(order);

    }
}

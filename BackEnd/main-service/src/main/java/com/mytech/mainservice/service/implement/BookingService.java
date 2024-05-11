package com.mytech.mainservice.service.implement;

import com.mytech.mainservice.dto.WorkingTimeDTO;
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
    private ModelMapper modelMapper;

    @Override
    public List<WorkingTimeDTO> getWorkingTimesByProvider(String providerId) {
        LocalDateTime oneMonthAfterNow = LocalDateTime.now().plusDays(30).withHour(1);
        return workingTimeRepo.findByProviderId(providerId,oneMonthAfterNow).stream()
                .map((element) -> modelMapper.map(element, WorkingTimeDTO.class)).toList();
    }
}

package com.mytech.mainservice.service;

import com.mytech.mainservice.dto.WorkingTimeDTO;
import com.mytech.mainservice.model.WorkingTime;

import java.util.List;

public interface IBookingService {
    List<WorkingTimeDTO> getWorkingTimesByProvider(String providerId);
}

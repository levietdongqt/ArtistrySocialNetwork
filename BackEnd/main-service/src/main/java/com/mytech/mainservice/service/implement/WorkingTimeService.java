package com.mytech.mainservice.service.implement;

import com.mytech.mainservice.dto.WorkingTimeDTO;
import com.mytech.mainservice.service.IWorkingTimeService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WorkingTimeService implements IWorkingTimeService {
    @Override
    public void createWorkingTime(WorkingTimeDTO workingTimeDTO) {

    }

    @Override
    public void updateWorkingTime(WorkingTimeDTO workingTimeDTO) {

    }

    @Override
    public void deleteWorkingTime(long workingTimeId) {

    }

    @Override
    public WorkingTimeDTO getWorkingTimeById(long workingTimeId) {
        return null;
    }

    @Override
    public List<WorkingTimeDTO> getWorkingTimes() {
        return null;
    }
}

package com.mytech.mainservice.service;

import com.mytech.mainservice.dto.WorkingTimeDTO;

import java.util.List;

public interface IWorkingTimeService {
    public void createWorkingTime(WorkingTimeDTO workingTimeDTO);

    public void updateWorkingTime(WorkingTimeDTO workingTimeDTO);

    public void deleteWorkingTime(long workingTimeId);

    public WorkingTimeDTO getWorkingTimeById(long workingTimeId);

    public List<WorkingTimeDTO> getWorkingTimes();
}

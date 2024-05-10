package com.mytech.mainservice.service;

import com.mytech.mainservice.dto.WorkingTimeDTO;
import com.mytech.mainservice.model.WorkingTime;

import java.util.List;

public interface IWorkingTimeService {
    public void createWorkingTime(WorkingTimeDTO workingTimeDTO);

    public void updateWorkingTime(WorkingTimeDTO workingTimeDTO);

    public void deleteWorkingTime(String userId,long workingTimeId);

    void updateWorkingTime(String userId, long workingTimeId);

    public WorkingTimeDTO getWorkingTimeById(String userId, long workingTimeId);
    public WorkingTime getDBWorkingTimeById(String userId, long workingTimeId);

    public List<WorkingTimeDTO> getAllWorkingTimes(String userId);

    public List<WorkingTimeDTO> getAllWorkingTimesByStatus(String userId,boolean status);
}

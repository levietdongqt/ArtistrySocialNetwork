package com.mytech.mainservice.service.implement;

import com.mytech.mainservice.dto.WorkingTimeDTO;
import com.mytech.mainservice.exception.myException.NotFoundException;
import com.mytech.mainservice.model.WorkingTime;
import com.mytech.mainservice.repository.IWorkingTimeRepository;
import com.mytech.mainservice.service.IWorkingTimeService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class WorkingTimeService implements IWorkingTimeService {

    @Autowired
    private IWorkingTimeRepository workingTimeRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public void createWorkingTime(WorkingTimeDTO workingTimeDTO) {
        var workingTime = modelMapper.map(workingTimeDTO, WorkingTime.class);
        workingTimeRepository.save(workingTime);
    }

    @Override
    public void updateWorkingTime(WorkingTimeDTO workingTimeDTO) {
        var workingTime = getDBWorkingTimeById(workingTimeDTO.getProvider().getId(),workingTimeDTO.getId());
        workingTime.setStartDate(workingTimeDTO.getStartDate());
        workingTime.setEndDate(workingTimeDTO.getEndDate());
        workingTime.setWorkingDays(workingTimeDTO.getWorkingDays());
        workingTimeRepository.save(workingTime);
    }

    @Override
    public void deleteWorkingTime(String userId,long workingTimeId) {
        var workingTime = getDBWorkingTimeById(userId,workingTimeId);
        workingTime.setStatus(false);
        workingTimeRepository.save(workingTime);
    }

    @Override
    public void updateWorkingTime(String userId, long workingTimeId) {
        var workingTime = getDBWorkingTimeById(userId,workingTimeId);
        workingTime.setStatus(true);
        workingTimeRepository.save(workingTime);
    }

    @Override
    public WorkingTimeDTO getWorkingTimeById(String userId,long workingTimeId){
        var workingTime = workingTimeRepository.getWorkingTimeByUser(userId,workingTimeId);
        if (workingTime.isPresent()){
            var wkTime = workingTime.get();
            var workingTimeDto = modelMapper.map(wkTime,WorkingTimeDTO.class);
            return workingTimeDto;
        }
        throw new NotFoundException("Không tìm thấy working time");
    }

    @Override
    public WorkingTime getDBWorkingTimeById(String userId, long workingTimeId) {
        var workingTime = workingTimeRepository.getWorkingTimeByUser(userId,workingTimeId);
        if (workingTime.isPresent()){
            return workingTime.get();
        }
        throw new NotFoundException("Không tìm thấy working time");
    }

    @Override
    public List<WorkingTimeDTO> getAllWorkingTimes(String userId) {
        List<WorkingTimeDTO> workingTimeDTOs = new ArrayList<>();
        var workingTimes = workingTimeRepository.getAllWorkingTimesByUser(userId);
        return getWorkingTimeDTOS(workingTimeDTOs, workingTimes);

    }

    private List<WorkingTimeDTO> getWorkingTimeDTOS(List<WorkingTimeDTO> workingTimeDTOs, List<WorkingTime> workingTimes) {
        if (workingTimes.isEmpty()){
            return workingTimeDTOs;
        }
        for (int i = 0; i < workingTimes.size(); i++) {
            var workingTimeDTO = modelMapper.map(workingTimes.get(i),WorkingTimeDTO.class);
            workingTimeDTOs.add(workingTimeDTO);
        }
        return workingTimeDTOs;
    }

    @Override
    public List<WorkingTimeDTO> getAllWorkingTimesByStatus(String userId, boolean status) {
        List<WorkingTimeDTO> workingTimeDTOs = new ArrayList<>();
        var workingTimes = workingTimeRepository.getWorkingTimesByUser(userId,status);
        return getWorkingTimeDTOS(workingTimeDTOs, workingTimes);
    }


}

package com.mytech.mainservice.service;

import com.mytech.mainservice.dto.MainServiceDTO;
import com.mytech.mainservice.dto.SaveServiceDTO;
import com.mytech.mainservice.model.MainService;

import java.util.List;
import java.util.Set;

public interface IMainSerService {
    Set<MainServiceDTO> getMainServices(String userId);
    void saveMainService(SaveServiceDTO saveServiceDTO);

    List<MainServiceDTO> findMainServiceSavedByUserId(String userId);
    MainServiceDTO getById(long serviceId);

    void deleteAllSaved(String userId);
    void createMainService(MainServiceDTO mainServiceDTO);

    void deleteService(Long serviceId);

    void updateService(MainServiceDTO mainServiceDTO);
}

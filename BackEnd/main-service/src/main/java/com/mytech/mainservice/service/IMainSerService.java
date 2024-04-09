package com.mytech.mainservice.service;

import com.mytech.mainservice.dto.MainServiceDTO;

import java.util.Set;

public interface IMainSerService {
    Set<MainServiceDTO> getMainServices(String userId);

    MainServiceDTO getById(long serviceId);

    void createMainService(MainServiceDTO mainServiceDTO);

    void deleteService(Long serviceId);

    void updateService(MainServiceDTO mainServiceDTO);
}

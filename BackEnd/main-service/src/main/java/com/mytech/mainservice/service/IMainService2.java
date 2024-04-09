package com.mytech.mainservice.service;

import com.mytech.mainservice.dto.MainServiceDTO;

import java.util.Set;

public interface IMainService2 {
    void addService(MainServiceDTO service);
    Set<MainServiceDTO> getMainServices(String userId);

    MainServiceDTO getById(long serviceId);

    void createMainService(MainServiceDTO mainServiceDTO);
}

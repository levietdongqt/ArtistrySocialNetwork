package com.mytech.mainservice.service;

import com.mytech.mainservice.dto.ExtraServiceDTO;

import java.util.Set;

public interface IExtraSerService {
    Set<ExtraServiceDTO> getMainServices(String userId);

    ExtraServiceDTO getById(long serviceId);

    void createExtraService(ExtraServiceDTO mainServiceDTO);

    void deleteService(Long serviceId);

    void updateService(ExtraServiceDTO mainServiceDTO);
}

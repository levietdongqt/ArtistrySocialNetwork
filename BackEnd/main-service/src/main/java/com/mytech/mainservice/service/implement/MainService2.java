package com.mytech.mainservice.service.implement;

import com.mytech.mainservice.dto.MainServiceDTO;
import com.mytech.mainservice.model.MainService;
import com.mytech.mainservice.repository.IMainServiceRepository;
import com.mytech.mainservice.service.IMainService2;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
public class MainService2 implements IMainService2 {
    @Autowired
    private IMainServiceRepository mainServiceRepo;
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public void addService(MainServiceDTO service) {

    }

    @Override
    public Set<MainServiceDTO> getMainServices(String userId) {
        return mainServiceRepo.findMainServiceByProvider_IdAndStatus(userId, true).stream()
                .map(mainService -> modelMapper.map(mainService, MainServiceDTO.class))
                .collect(Collectors.toSet());
    }
}

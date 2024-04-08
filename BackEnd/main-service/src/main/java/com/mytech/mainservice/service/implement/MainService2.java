package com.mytech.mainservice.service.implement;

import com.mytech.mainservice.dto.ExtraServiceDTO;
import com.mytech.mainservice.dto.MainServiceDTO;
import com.mytech.mainservice.dto.PromotionDTO;
import com.mytech.mainservice.exception.myException.NotFoundException;
import com.mytech.mainservice.model.ExtraService;
import com.mytech.mainservice.model.MainService;
import com.mytech.mainservice.model.Promotion;
import com.mytech.mainservice.repository.IExtraServiceRepository;
import com.mytech.mainservice.repository.IMainServiceRepository;
import com.mytech.mainservice.repository.IPromotionRepository;
import com.mytech.mainservice.service.IMainService2;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class MainService2 implements IMainService2 {
    @Autowired
    private IMainServiceRepository mainServiceRepo;
    @Autowired
    private IPromotionRepository promotionRepo;
    @Autowired
    private IExtraServiceRepository extraServiceRepo;
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

    @Override
    public MainServiceDTO getById(long serviceId) {
        var mainService = mainServiceRepo.findById(serviceId);
        if (mainService.isPresent()) {
            return modelMapper.map(mainService, MainServiceDTO.class);
        }
        throw new NotFoundException("Not found main service ");
    }

    @Override
    public void createMainService(MainServiceDTO mainServiceDTO) {
        MainService mainService = modelMapper.map(mainServiceDTO, MainService.class);
        List<ExtraService> extraServices = checkInvalidExtraServiceIds(mainServiceDTO.getExtraServiceDTOs());
        Promotion promotion = checkInvalidPromotion(mainServiceDTO.getPromotionDTO());
        mainService.setPromotion(promotion);
        mainService.setExtraServices(extraServices);
        mainServiceRepo.save(mainService);
    }
    private Promotion checkInvalidPromotion(PromotionDTO promotionDTO) {
        if (promotionDTO == null) {
            return null;
        }
        Optional<Promotion> promotion = promotionRepo.findById(promotionDTO.getId());
        if (promotion.isPresent()) {
            return promotion.get();
        }
        throw new NotFoundException("Not found promotion ");
    }

    private List<ExtraService> checkInvalidExtraServiceIds(List<ExtraServiceDTO> extraServiceDTOs) {
        if (extraServiceDTOs == null) {
            return List.of();
        }
        List<Long> extraServiceIds = extraServiceDTOs.stream().map(ExtraServiceDTO::getId).toList();
        List<ExtraService> extraServices = extraServiceRepo.findByIdList(extraServiceIds);
        if (extraServices.size() != extraServiceDTOs.size()) {
            throw new NotFoundException("Not found extra service ");
        }
        return extraServices;
    }
}

package com.mytech.mainservice.service.implement;

import com.mytech.mainservice.dto.ExtraServiceDTO;
import com.mytech.mainservice.dto.MainServiceDTO;
import com.mytech.mainservice.dto.PromotionDTO;
import com.mytech.mainservice.enums.PromotionType;
import com.mytech.mainservice.exception.myException.InvalidPropertyException;
import com.mytech.mainservice.exception.myException.NotFoundException;
import com.mytech.mainservice.helper.JwtTokenHolder;
import com.mytech.mainservice.model.ExtraService;
import com.mytech.mainservice.model.MainService;
import com.mytech.mainservice.model.Promotion;
import com.mytech.mainservice.repository.IExtraServiceRepository;
import com.mytech.mainservice.repository.IMainServiceRepository;
import com.mytech.mainservice.repository.IPromotionRepository;
import com.mytech.mainservice.service.IMainSerService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class MainSerService implements IMainSerService {
    @Autowired
    private IMainServiceRepository mainServiceRepo;
    @Autowired
    private IPromotionRepository promotionRepo;
    @Autowired
    private IExtraServiceRepository extraServiceRepo;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private JwtTokenHolder jwtTokenHolder;

    @Override
    public Set<MainServiceDTO> getMainServices(String userId) {
        return mainServiceRepo.findMainServiceByProvider_IdAndStatus(userId, true).stream()
                .map(mainService -> modelMapper.map(mainService, MainServiceDTO.class))
                .collect(Collectors.toSet());
    }

    @Override
    public MainServiceDTO getById(long serviceId) {
        var mainService = mainServiceRepo.findById(serviceId);
        if (mainService.isEmpty()) {
            throw new NotFoundException("Not found main service ");
        }
        if (!mainService.get().isStatus()) {
            throw new InvalidPropertyException("This service has deleted before");
        }
        return modelMapper.map(mainService, MainServiceDTO.class);
    }

    @Override
    public void createMainService(MainServiceDTO mainServiceDTO) {
        MainService mainService = modelMapper.map(mainServiceDTO, MainService.class);
        List<ExtraService> extraServices = checkValidExtraServiceIds(mainServiceDTO.getExtraServiceDTOs());
        Promotion promotion = checkValidPromotion(mainServiceDTO.getPromotionDTO());
        mainService.setPromotion(promotion);
        mainService.setStatus(true);
        mainService.setCreateDate(LocalDateTime.now());
        mainService.setExtraServices(extraServices);
        mainServiceRepo.save(mainService);
    }

    @Override
    public void deleteService(Long serviceId) {
        Optional<MainService> mainService = mainServiceRepo.findById(serviceId);
        if (mainService.isEmpty()) {
            throw new NotFoundException("Not found main service ");
        }
        if (jwtTokenHolder.isValidUserId(mainService.get().getProvider().getId())) {
            mainService.get().setStatus(false);
            mainServiceRepo.save(mainService.get());
            return;
        }
        throw new InvalidPropertyException("You are not the owner of this service");
    }

    @Override
    public void updateService(MainServiceDTO mainServiceDTO) {
        MainService mainService = modelMapper.map(mainServiceDTO, MainService.class);
        mainServiceRepo.save(mainService);
    }

    private boolean isValidUser(String userId) {
        return jwtTokenHolder.getUserId().equals(userId);
    }

    private Promotion checkValidPromotion(PromotionDTO promotionDTO) {
        if (promotionDTO == null) {
            return null;
        }
        Optional<Promotion> promotion = promotionRepo.findById(promotionDTO.getId());
        if (promotion.isEmpty()) {
            throw new NotFoundException("Not found promotion ");
        }
        if (promotion.get().getType() != PromotionType.FOR_SERVICE) {
            throw new InvalidPropertyException("This promotion is not for service");
        }
        return promotion.get();

    }

    private List<ExtraService> checkValidExtraServiceIds(List<ExtraServiceDTO> extraServiceDTOs) {
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

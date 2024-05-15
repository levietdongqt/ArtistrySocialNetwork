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
import com.mytech.mainservice.service.IExtraSerService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ExtraSerService implements IExtraSerService {
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
    public Set<ExtraServiceDTO> getMainServices(String userId) {
        return extraServiceRepo.findExtraServiceByProvider_Id(userId).stream()
                .map(extra -> modelMapper.map(extra, ExtraServiceDTO.class))
                .collect(Collectors.toSet());
    }

    @Override
    public ExtraServiceDTO getById(long serviceId) {
        var extraService = extraServiceRepo.findById(serviceId);
        if (extraService.isEmpty()) {
            throw new NotFoundException("Not found main service ");
        }
        if (!extraService.get().isStatus()) {
            throw new InvalidPropertyException("This service has deleted before");
        }
        return modelMapper.map(extraService, ExtraServiceDTO.class);
    }

    @Override
    public void createExtraService(ExtraServiceDTO extraServiceDTO) {
        ExtraService extraService = modelMapper.map(extraServiceDTO, ExtraService.class);
        Promotion promotion = checkValidPromotion(extraServiceDTO.getPromotionDTO());
        extraService.setPromotionDTO(promotion);
        extraService.setStatus(true);
        extraService.setCreateDate(LocalDateTime.now());
        extraServiceRepo.save(extraService);
    }

    @Override
    public void deleteService(Long serviceId) {
        Optional<ExtraService> extraService = extraServiceRepo.findById(serviceId);
        if (extraService.isEmpty()) {
            throw new NotFoundException("Not found main service ");
        }
        if (isValidUser(extraService.get().getProvider().getId())) {
            if (extraService.get().isStatus() ) {
                extraService.get().setStatus(false);
                extraServiceRepo.save(extraService.get());
                return;
            } else {
                extraService.get().setStatus(true);
                extraServiceRepo.save(extraService.get());
            }

            return;
        }
        throw new InvalidPropertyException("You are not the owner of this service");
    }

    @Override
    public void updateService(ExtraServiceDTO extraServiceDTO) {
        ExtraService extraService = modelMapper.map(extraServiceDTO, ExtraService.class);
        extraServiceRepo.save(extraService);
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

}

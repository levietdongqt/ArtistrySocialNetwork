package com.mytech.mainservice.service.implement;

import com.mytech.mainservice.dto.PromotionDTO;
import com.mytech.mainservice.exception.myException.NotFoundException;
import com.mytech.mainservice.model.Promotion;
import com.mytech.mainservice.repository.IMainServiceRepository;
import com.mytech.mainservice.repository.IPromotionRepository;
import com.mytech.mainservice.service.IMainSerService;
import com.mytech.mainservice.service.IPromotionService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PromotionService implements IPromotionService {

    @Autowired
    private IPromotionRepository promotionRepository;

    @Autowired
    private IMainSerService mainSerService;

    @Autowired
    private IMainServiceRepository mainServiceRepository;

    @Autowired
    private ModelMapper modelMapper;
    @Override
    public void createPromotion(PromotionDTO promotionDTO) {
        var promotion = modelMapper.map(promotionDTO, Promotion.class);
        promotionRepository.save(promotion);
    }

    @Override
    public void updatePromotion(PromotionDTO promotionDTO) {
        var promotion = getDBPromotionById(promotionDTO.getUser().getId(),promotionDTO.getId());
        promotion.setName(promotionDTO.getName());
        promotion.setEndDate(promotionDTO.getEndDate());
        promotion.setStartDate(promotionDTO.getStartDate());
        promotion.setDiscountPercent(promotionDTO.getDiscountPercent());
        promotion.setDescription(promotionDTO.getDescription());
        promotion.setType(promotionDTO.getType());
        promotionRepository.save(promotion);
    }

    @Override
    public void deletePromotion(String userId, long promotionId) {
        var promotion = getDBPromotionById(userId,promotionId);
        promotion.setStatus(false);
        promotionRepository.save(promotion);
    }


    @Override
    public PromotionDTO getPromotionById(String userId,long promotionId) {
        var promotion = promotionRepository.getPromotionByUser(userId,promotionId);
        if (promotion.isPresent()){
            return modelMapper.map(promotion.get(), PromotionDTO.class);
        }
        throw new NotFoundException("Không tìm thấy Promotion");
    }

    @Override
    public Promotion getDBPromotionById(String userId, long promotionId) {
        var promotion = promotionRepository.getPromotionByUser(userId,promotionId);
        if (promotion.isPresent()){
            return promotion.get();
        }
        throw new NotFoundException("Không tìm thấy Promotion trong Database");
    }

    @Override
    public List<PromotionDTO> getPromotionsForServiceAndOrder(String userId,boolean status,boolean isExpired){
        var promotions = promotionRepository.getPromotionsByUser(userId,status);
        if(isExpired){
            return promotions
                    .stream().filter(promotion -> promotion.getEndDate().isBefore(LocalDateTime.now()))
                    .map((promotion -> modelMapper.map(promotion, PromotionDTO.class)))
                    .collect(Collectors.toList());
        }
        return promotions
                .stream().filter(promotion -> promotion.getEndDate().isAfter(LocalDateTime.now()))
                .map((promotion -> modelMapper.map(promotion, PromotionDTO.class)))
                .collect(Collectors.toList());

    }

    public List<PromotionDTO> getAllPromotions(String userId){
        var promotions = promotionRepository.getAllPromotionsByUser(userId);
        return promotions
               .stream()
               .map(promotion -> modelMapper.map(promotion, PromotionDTO.class))
               .collect(Collectors.toList());
    }

    @Override
    public void applyPromotionForMainService(String userId, long mainServiceId, long promotionId) {
        var mainService = mainServiceRepository.getById(mainServiceId);
        var promotion = getDBPromotionById(userId,promotionId);
        //Check sự xem promotion trong mainService đã có hay chưa?
        var promotionsInMainService = mainService.getPromotion();
        if (promotionsInMainService.getId() == promotion.getId()) {
            if (!promotionsInMainService.isStatus()){
                mainService.setPromotion(promotion);
                mainServiceRepository.save(mainService);
                return;
            }
            throw new RuntimeException("Đã tồn tại promotion này rồi");
        }
        mainService.setPromotion(promotion);
        mainServiceRepository.save(mainService);
    }

    @Override
    public void applyPromotionForExtraService(String userId,long extraServiceId, long promotionId) {

    }

    @Override
    public void applyPromotionForOrderService(String userId,long extraServiceId, long promotionId) {

    }
}

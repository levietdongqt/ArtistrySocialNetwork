package com.mytech.mainservice.service;

import com.mytech.mainservice.dto.PromotionDTO;
import com.mytech.mainservice.model.Promotion;

import java.util.List;

public interface IPromotionService {
    public void createPromotion(PromotionDTO promotionDTO);

    public void updatePromotion(PromotionDTO promotionDTO);

    void deletePromotion(String userId, long promotionId);

    void updatePromotion(String userId, long workingTimeId);

    public PromotionDTO getPromotionById(String userId, long promotionId);

    public Promotion getDBPromotionById(String userId, long promotionId);

    List<PromotionDTO> getPromotionsForServiceAndOrder(String userId, boolean status, boolean isExpired);

    List<PromotionDTO> getAllPromotions(String userId);

    void applyPromotionForMainService(String userId, long mainServiceId, long promotionId);

    void applyPromotionForExtraService(String userId, long extraServiceId, long promotionId);

    void applyPromotionForOrderService(String userId, long extraServiceId, long promotionId);
}

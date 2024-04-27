package com.mytech.mainservice.service;

import com.mytech.mainservice.dto.PromotionDTO;
import com.mytech.mainservice.model.Promotion;

import java.util.List;

public interface IPromotionService {
    public void createPromotion(PromotionDTO promotionDTO);

    public void updatePromotion(PromotionDTO promotionDTO);

    void deletePromotion(String userId, long promotionId);

    public PromotionDTO getPromotionById(String userId, long promotionId);

    public Promotion getDBPromotionById(String userId, long promotionId);

    List<PromotionDTO> getPromotions(String userId, boolean status, boolean isExpired);

    void applyPromotionForMainService(String userId, long mainServiceId, long promotionId);

    void applyPromotionForExtraService(String userId, long extraServiceId, long promotionId);

    void applyPromotionForOrderService(String userId, long extraServiceId, long promotionId);
}

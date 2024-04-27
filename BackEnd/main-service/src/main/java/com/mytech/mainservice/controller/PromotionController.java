package com.mytech.mainservice.controller;

import com.mytech.mainservice.dto.MainServiceDTO;
import com.mytech.mainservice.dto.PromotionDTO;
import com.mytech.mainservice.dto.ResponseObject;
import com.mytech.mainservice.service.IPromotionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;
import java.util.Set;

@Controller
@RequestMapping("promotions")
public class PromotionController {

    @Autowired
    private IPromotionService promotionService;

    @GetMapping("/{userId}/get-all")
    public ResponseEntity<?> getPromotions(@PathVariable("userId") String userId, @Param("status") boolean status, @Param("isExpired") boolean expired) {
        List<PromotionDTO> lists = promotionService.getPromotions(userId, status, expired);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Get Service successfully")
                        .data(lists).build()
        );
    }
}

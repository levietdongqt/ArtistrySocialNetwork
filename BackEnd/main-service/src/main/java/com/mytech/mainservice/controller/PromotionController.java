package com.mytech.mainservice.controller;

import com.mytech.mainservice.dto.MainServiceDTO;
import com.mytech.mainservice.dto.PromotionDTO;
import com.mytech.mainservice.dto.ResponseObject;
import com.mytech.mainservice.service.IPromotionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@Controller
@RequestMapping("promotions")
public class PromotionController {

    @Autowired
    private IPromotionService promotionService;
    @GetMapping("/{userId}/get-all-by-status")
    public ResponseEntity<?> getPromotions(@PathVariable("userId") String userId, @Param("status") boolean status, @Param("isExpired") boolean expired) {
        List<PromotionDTO> lists = promotionService.getPromotionsForServiceAndOrder(userId, status, expired);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Get Promotion successfully")
                        .data(lists).build()
        );
    }

    @PreAuthorize("@jwtTokenHolder.isValidUserId(#userId) && hasRole('PROVIDER')")
    @GetMapping("/{userId}/get-all")
    public ResponseEntity<?> getAllPromotions(@PathVariable("userId") String userId) {
        List<PromotionDTO> lists = promotionService.getAllPromotions(userId);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Get Promotion successfully")
                        .data(lists).build()
        );
    }

    @PreAuthorize("@jwtTokenHolder.isValidUserId(#userId) && hasRole('PROVIDER')")
    @PostMapping("/{userId}/save")
    public ResponseEntity<?> createPromotion(@PathVariable("userId") String userId, @RequestBody PromotionDTO promotionDTO){
        promotionService.createPromotion(promotionDTO);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Create Promotion successfully")
                        .data(null).build()
        );
    }

    @PreAuthorize("@jwtTokenHolder.isValidUserId(#userId) && hasRole('PROVIDER')")
    @PutMapping("/{userId}/update")
    public ResponseEntity<?> updatePromotion(@PathVariable("userId") String userId, @RequestBody PromotionDTO promotionDTO){
        promotionService.updatePromotion(promotionDTO);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Update Promotion successfully")
                        .data(null).build()
        );
    }

    @PreAuthorize("@jwtTokenHolder.isValidUserId(#userId) && hasRole('PROVIDER')")
    @DeleteMapping("/{userId}/delete/{promotionId}")
    public ResponseEntity<?> deletePromotion(@PathVariable("userId") String userId,@PathVariable("promotionId") Long promotionId){
        promotionService.deletePromotion(userId,promotionId);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Delete Promotion successfully")
                        .data(null).build()
        );
    }

    @PreAuthorize("@jwtTokenHolder.isValidUserId(#userId) && hasRole('PROVIDER')")
    @PutMapping("/{userId}/rework/{promotionId}")
    public ResponseEntity<?> reworkPromotion(@PathVariable("userId") String userId,@PathVariable("promotionId") Long promotionId){
        promotionService.updatePromotion(userId,promotionId);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Delete Promotion successfully")
                        .data(null).build()
        );
    }
}

package com.mytech.mainservice.controller;

import com.mytech.mainservice.dto.ResponseObject;
import com.mytech.mainservice.dto.ReviewDTO;
import com.mytech.mainservice.service.IReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/review")
public class ReviewController {

    @Autowired
    private IReviewService reviewService;

    @PreAuthorize("hasRole('USER')")
    @PostMapping("/create")
    public ResponseEntity<?> createReview(@RequestBody ReviewDTO reviewDTO) {
        reviewService.createReview(reviewDTO);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .status(HttpStatus.CREATED)
                        .message("Create Review successfully")
                        .data(null).build()
        );
    }

    @GetMapping("get-all/{userId}")
    public ResponseEntity<?> getReviewsByUserId(@PathVariable String userId) {

        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Get Reviews successfully")
                        .data(reviewService.getReviewsByUserId(userId)).build()
        );
    }
}

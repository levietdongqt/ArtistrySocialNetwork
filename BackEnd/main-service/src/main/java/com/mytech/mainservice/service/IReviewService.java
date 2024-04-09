package com.mytech.mainservice.service;

import com.mytech.mainservice.dto.ReviewDTO;

import java.util.List;
import java.util.TreeSet;

public interface IReviewService {
    void createReview(ReviewDTO reviewDTO);

    List<ReviewDTO> getReviewsByUserId(String userId);
}

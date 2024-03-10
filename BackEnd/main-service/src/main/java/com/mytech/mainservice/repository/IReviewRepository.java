package com.mytech.mainservice.repository;

import com.mytech.mainservice.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IReviewRepository extends JpaRepository<Review, Long> {
}
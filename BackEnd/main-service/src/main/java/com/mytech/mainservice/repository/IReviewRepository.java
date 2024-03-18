package com.mytech.mainservice.repository;

import com.mytech.mainservice.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository

public interface IReviewRepository extends JpaRepository<Review, Long> {
}
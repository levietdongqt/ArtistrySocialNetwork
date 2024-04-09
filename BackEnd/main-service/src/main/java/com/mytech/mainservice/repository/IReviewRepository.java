package com.mytech.mainservice.repository;

import com.mytech.mainservice.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository

public interface IReviewRepository extends JpaRepository<Review, Long> {
    Set<Review> findByProviderUser_Id(String userId);
}
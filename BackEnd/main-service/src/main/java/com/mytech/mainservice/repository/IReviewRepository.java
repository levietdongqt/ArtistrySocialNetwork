package com.mytech.mainservice.repository;

import com.mytech.mainservice.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository

public interface IReviewRepository extends JpaRepository<Review, Long> {

    @Query("SELECT r FROM Review r WHERE  r.providerUser.id = :userId")
    Set<Review> findByProviderUser_Id(@Param("userId") String userId);
}
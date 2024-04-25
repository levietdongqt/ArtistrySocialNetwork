package com.mytech.mainservice.repository;

import com.mytech.mainservice.model.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository

public interface IPromotionRepository extends JpaRepository<Promotion, Long> {
    @Query("SELECT r FROM Promotion r WHERE r.user.id = :userId and r.status= :status")
    List<Promotion> getPromotionsByUser(@Param("userId") String userId, @Param("status") boolean status);

    @Query("SELECT r FROM Promotion r WHERE r.user.id = :userId and r.id = :promotionId")
    Optional<Promotion> getPromotionByUser(@Param("userId") String userId, @Param("promotionId") long promotionId);
}
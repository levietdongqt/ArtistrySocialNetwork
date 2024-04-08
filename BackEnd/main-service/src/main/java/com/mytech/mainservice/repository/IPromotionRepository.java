package com.mytech.mainservice.repository;

import com.mytech.mainservice.model.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository

public interface IPromotionRepository extends JpaRepository<Promotion, Long> {
}
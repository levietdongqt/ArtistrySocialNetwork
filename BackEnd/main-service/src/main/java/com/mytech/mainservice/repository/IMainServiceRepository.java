package com.mytech.mainservice.repository;

import com.mytech.mainservice.model.MainService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository

public interface IMainServiceRepository extends JpaRepository<MainService, Long> {
    Set<MainService> findMainServiceByProvider_IdAndStatus(String userId,boolean status);
}
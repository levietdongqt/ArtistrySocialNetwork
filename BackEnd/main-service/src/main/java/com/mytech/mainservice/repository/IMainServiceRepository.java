package com.mytech.mainservice.repository;

import com.mytech.mainservice.model.MainService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository

public interface IMainServiceRepository extends JpaRepository<MainService, Long> {
}
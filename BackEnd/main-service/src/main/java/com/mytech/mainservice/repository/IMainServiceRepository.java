package com.mytech.mainservice.repository;

import com.mytech.mainservice.model.MainService;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IMainServiceRepository extends JpaRepository<MainService, Long> {
}
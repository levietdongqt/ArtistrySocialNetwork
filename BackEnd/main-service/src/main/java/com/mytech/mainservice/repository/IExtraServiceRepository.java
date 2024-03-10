package com.mytech.mainservice.repository;

import com.mytech.mainservice.model.ExtraService;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IExtraServiceRepository extends JpaRepository<ExtraService, Long> {
}
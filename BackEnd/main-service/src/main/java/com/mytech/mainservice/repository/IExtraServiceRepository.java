package com.mytech.mainservice.repository;

import com.mytech.mainservice.model.ExtraService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IExtraServiceRepository extends JpaRepository<ExtraService, Long> {
}
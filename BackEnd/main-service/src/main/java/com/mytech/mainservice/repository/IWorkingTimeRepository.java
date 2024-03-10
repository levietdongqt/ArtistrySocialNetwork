package com.mytech.mainservice.repository;

import com.mytech.mainservice.model.WorkingTime;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IWorkingTimeRepository extends JpaRepository<WorkingTime, Long> {
}
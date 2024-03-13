package com.mytech.mainservice.repository;

import com.mytech.mainservice.model.WorkingTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository

public interface IWorkingTimeRepository extends JpaRepository<WorkingTime, Long> {
}
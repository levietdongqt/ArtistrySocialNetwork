package com.mytech.mainservice.repository;

import com.mytech.mainservice.model.WorkingTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository

public interface IWorkingTimeRepository extends JpaRepository<WorkingTime, Long> {

    @Query("SELECT w FROM WorkingTime w where w.provider.id = :id and " +
            " not ( (w.startDate < current_date() and w.endDate < current_date()) or (w.startDate > :oneMonthAfterNow   and w.endDate > :oneMonthAfterNow)) ")
    List<WorkingTime> findByProviderId(@Param("id") String providerId, @Param("oneMonthAfterNow")LocalDateTime oneMonthAfterNow);
}
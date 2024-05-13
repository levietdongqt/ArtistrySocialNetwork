package com.mytech.mainservice.repository;

import com.mytech.mainservice.model.Promotion;
import com.mytech.mainservice.model.WorkingTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.List;
import java.util.Optional;

@Repository

public interface IWorkingTimeRepository extends JpaRepository<WorkingTime, Long> {

    @Query("SELECT w FROM WorkingTime w where w.provider.id = :id and " +
            " not ( (w.startDate < current_date() and w.endDate < current_date()) or (w.startDate > :oneMonthAfterNow   and w.endDate > :oneMonthAfterNow)) ")
    List<WorkingTime> findByProviderId(@Param("id") String providerId, @Param("oneMonthAfterNow")LocalDateTime oneMonthAfterNow);
    @Query("SELECT w FROM WorkingTime w WHERE w.provider.id = :userId and w.id = :workingTimeId")
    Optional<WorkingTime> getWorkingTimeByUser(@Param("userId") String userId, @Param("workingTimeId") long workingTimeId);

    @Query("SELECT w FROM WorkingTime w WHERE w.provider.id = :userId and w.status= :status")
    List<WorkingTime> getWorkingTimesByUser(@Param("userId") String userId, @Param("status") boolean status);

    @Query("SELECT w FROM WorkingTime w WHERE w.provider.id = :userId")
    List<WorkingTime> getAllWorkingTimesByUser(@Param("userId") String userId);
}
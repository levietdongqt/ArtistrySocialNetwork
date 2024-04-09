package com.mytech.mainservice.repository;

import com.mytech.mainservice.dto.MainServiceDTO;
import com.mytech.mainservice.model.ExtraService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IExtraServiceRepository extends JpaRepository<ExtraService, Long> {
    @Query("SELECT e FROM ExtraService e where e.id in :ids")
    List<ExtraService> findByIdList(@Param("ids") List<Long> ids);
}
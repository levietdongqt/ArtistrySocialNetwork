package com.mytech.mainservice.repository;

import com.mytech.mainservice.dto.MainServiceDTO;
import com.mytech.mainservice.model.ExtraService;
import org.springframework.beans.PropertyValues;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface IExtraServiceRepository extends JpaRepository<ExtraService, Long> {
    @Query("SELECT e FROM ExtraService e where e.id in :ids")
    List<ExtraService> findByIdList(@Param("ids") List<Long> ids);

    Set<ExtraService> findExtraServiceByProvider_IdAndStatus(String userId, boolean status);
}
package com.mytech.mainservice.repository;

import com.mytech.mainservice.model.MainService;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface IMainServiceRepository extends JpaRepository<MainService, Long> {
    Set<MainService> findMainServiceByProvider_IdAndStatus(String userId,boolean status);

    @Transactional
    @Modifying
    @Query("update MainService m set m = :service where m.id = :id")
    int update(@Param("service") MainService service,@Param("id") long id);

    @Query("SELECT m FROM MainService m WHERE m.description LIKE %:keyword% OR m.name LIKE %:keyword% OR m.provider.fullName LIKE %:keyword%")
    Set<MainService> searchMainServiceByKeyword(@Param("keyword") String keyword);
}
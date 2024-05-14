package com.mytech.mainservice.repository;

import com.mytech.mainservice.model.MainService;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface IMainServiceRepository extends JpaRepository<MainService, Long> {
    Set<MainService> findMainServiceByProvider_Id(String userId);

    @Transactional
    @Modifying
    @Query("update MainService m set m = :service where m.id = :id")
    int update(@Param("service") MainService service,@Param("id") long id);

    @Query("SELECT m " +
            "FROM MainService m " +
            "WHERE m.description " +
            "LIKE %:keyword% OR m.name " +
            "LIKE %:keyword% OR m.provider.fullName " +
            "LIKE %:keyword% order by m.createDate desc ")
    Set<MainService> searchMainServiceByKeyword(@Param("keyword") String keyword);

    @Query("SELECT ms FROM MainService ms JOIN ms.savedByUser u WHERE u.id = :userId ORDER BY ms.createDate DESC")
    List<MainService> findMainServiceByUserId(@Param("userId") String userId);

    @Query("SELECT ms " +
            "FROM MainService ms " +
            "LEFT JOIN Order o " +
            "ON ms.id = o.mainService.id " +
            "GROUP BY ms " +
            "ORDER BY sum(o.amount) DESC")
    List<MainService> findTrendMainService(Pageable pageable);
}
package com.mytech.mainservice.repository;

import org.springframework.data.domain.Page;
import com.mytech.mainservice.dto.SaveServiceDTO;
import com.mytech.mainservice.model.MainService;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
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



    @Query("SELECT m FROM MainService m join m.savedByUser u WHERE m.id = :mainId AND u.id = :userId")
    Optional<MainService> findByIdAndUSerId(Long mainId, String userId);

    @Query(value = "SELECT EXISTS (SELECT * FROM saved_service WHERE main_service_id = :mainId AND user_id like :userId)", nativeQuery = true)
    Long existsByIdAndUserId(@Param("mainId") Long mainId,@Param("userId") String userId);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM saved_service WHERE user_id LIKE :userId", nativeQuery = true)
    void deleteSavedByUserId(@Param("userId") String userId);
    @Query("SELECT ms FROM MainService ms JOIN ms.savedByUser u WHERE u.id = :userId")
    Page<MainService> findMainServiceByUserId(@Param("userId") String userId, Pageable pageable);
}
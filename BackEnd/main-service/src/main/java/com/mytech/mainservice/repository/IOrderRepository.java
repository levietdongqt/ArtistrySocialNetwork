package com.mytech.mainservice.repository;

import com.mytech.mainservice.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface IOrderRepository extends JpaRepository<Order, Long> {

    @Query("SELECT o FROM Order o WHERE DATE(o.startDate) = :startDate AND o.providerUser.id = :providerId")
    List<Order> findByStartDateAndProviderUser_Id(LocalDate startDate, String providerId);

    List<Order> findByProviderUser_IdOrderByCreateDate(String providerId);
}




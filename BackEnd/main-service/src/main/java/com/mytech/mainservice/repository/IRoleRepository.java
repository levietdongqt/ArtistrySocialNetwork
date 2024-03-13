package com.mytech.mainservice.repository;

import com.mytech.mainservice.enums.UserRole;
import com.mytech.mainservice.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository

public interface IRoleRepository extends JpaRepository<Role, Long> {
    @Query("SELECT r FROM Role r WHERE r.name in :listName")
    List<Role> findByListName(@Param("listName") List<UserRole> listName);
}
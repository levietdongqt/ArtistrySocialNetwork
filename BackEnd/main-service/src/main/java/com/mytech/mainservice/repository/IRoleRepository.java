package com.mytech.mainservice.repository;

import com.mytech.mainservice.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IRoleRepository extends JpaRepository<Role, Long> {
}
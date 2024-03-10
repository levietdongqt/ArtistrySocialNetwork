package com.mytech.mainservice.repository;

import com.mytech.mainservice.model.Session;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ISessionRepository extends JpaRepository<Session, Long> {
}
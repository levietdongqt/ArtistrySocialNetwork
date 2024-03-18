package com.mytech.mainservice.repository;

import com.mytech.mainservice.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;
@Repository

public interface IUserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String username);
    Optional<User> findByEmailAndPassword(String username, String password);
    Optional<User> findByEmailOrPhoneNumber(String username, String phoneNumber);
}
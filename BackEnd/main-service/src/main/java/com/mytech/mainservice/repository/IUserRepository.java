package com.mytech.mainservice.repository;

import com.mytech.mainservice.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface IUserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String username);

    Optional<User> findByEmailAndPassword(String username, String password);

    @Query("SELECT u FROM User u WHERE (:email IS NOT NULL AND u.email = :email) or (:phoneNumber IS NOT NULL AND u.phoneNumber = :phoneNumber)")
    Optional<User> findByEmailOrPhoneNumber(@Param("email") String email, @Param("phoneNumber") String phoneNumber);
}
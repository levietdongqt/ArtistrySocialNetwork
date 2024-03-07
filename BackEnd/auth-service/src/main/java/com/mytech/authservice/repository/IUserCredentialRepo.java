package com.mytech.authservice.repository;


import com.mytech.authservice.model.UserCredential;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface IUserCredentialRepo extends JpaRepository<UserCredential, UUID> {
    Optional<UserCredential> findByEmail(String username);
}

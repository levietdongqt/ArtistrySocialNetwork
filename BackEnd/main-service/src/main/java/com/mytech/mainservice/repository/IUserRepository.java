package com.mytech.mainservice.repository;

import com.mytech.mainservice.model.User;
import jakarta.validation.constraints.NotNull;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;
import reactor.util.annotation.NonNullApi;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface IUserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String username);

    Optional<User> findByEmailAndPassword(String username, String password);

    @Query("SELECT u FROM User u WHERE (:email IS NOT NULL AND u.email = :email) or (:phoneNumber IS NOT NULL AND u.phoneNumber = :phoneNumber)")
    Optional<User> findByEmailOrPhoneNumber(@Param("email") String email, @Param("phoneNumber") String phoneNumber);

    Optional<User> findByPhoneNumber(String phoneNumber);
@Query("SELECT u FROM User u inner join Friendship f on u.id = f.friend.id" +
        " where f.fromUser.id = :userId and lower(u.fullName) like concat('%',lower(:search),'%') ")
    List<User> findFriendByFullname(String userId,String search);
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.roles")
    List<User> getAllContainRoles();



}
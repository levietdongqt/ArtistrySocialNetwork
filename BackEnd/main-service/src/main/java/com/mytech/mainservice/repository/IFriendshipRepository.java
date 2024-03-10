package com.mytech.mainservice.repository;

import com.mytech.mainservice.model.Friendship;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IFriendshipRepository extends JpaRepository<Friendship, Long> {
}
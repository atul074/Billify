package com.example.server.repo;

import com.example.server.model.Notification;
import com.example.server.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepo extends JpaRepository<Notification, Long>{
    List<Notification> findByUserOrderByCreatedAtDesc(Users user);
    Long countByUserAndReadStatusFalse(Users user);
    List<Notification> findByUserAndReadStatusFalse(Users user);
}

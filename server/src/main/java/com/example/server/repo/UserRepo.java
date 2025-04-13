package com.example.server.repo;

import com.example.server.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepo extends JpaRepository<Users,Integer> {
    Users findByUsername(String username);
    Users findByEmail(String email);
   // Users findById(Long id);
}

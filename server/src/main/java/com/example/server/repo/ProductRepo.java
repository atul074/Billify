package com.example.server.repo;

import com.example.server.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepo extends JpaRepository<Product, Long> {
    List<Product> findByNameContainingOrDescriptionContaining(String name, String description);
}

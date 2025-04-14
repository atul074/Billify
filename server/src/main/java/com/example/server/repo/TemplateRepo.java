package com.example.server.repo;

import com.example.server.model.Template;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TemplateRepo extends JpaRepository<Template, Long> {

}

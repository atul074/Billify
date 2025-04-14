package com.example.server.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "templates")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Template {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String filename;

    private String originalName;

    private String fileType;

    private String uploadedBy;


    private LocalDateTime uploadedAt = LocalDateTime.now();

    @Column(name = "default_template")
    private Boolean defaultTemplate = false;
}

package com.example.server.controller;

import com.example.server.model.Template;
import com.example.server.repo.TemplateRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/templates")
public class TemplateController {

    @Autowired
    private TemplateRepo templateRepository;

    private final String UPLOAD_DIR = "templates/";

    @PostMapping("/upload")
    public ResponseEntity<Template> uploadTemplate(
            @RequestParam("file") MultipartFile file,
            @RequestParam("uploadedBy") String uploadedBy) throws IOException {

        String originalName = file.getOriginalFilename();
        String fileType = file.getContentType();
        String storedName = UUID.randomUUID() + "_" + originalName;

        Path path = Paths.get(UPLOAD_DIR + storedName);
        Files.createDirectories(path.getParent());
        Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

        Template template = new Template();
        template.setFilename(storedName);
        template.setOriginalName(originalName);
        template.setFileType(fileType);
        template.setUploadedBy(uploadedBy);

        Template saved = templateRepository.save(template);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Resource> getTemplate(@PathVariable Long id) throws IOException {
        Template template = templateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Template not found"));

        Path path = Paths.get(UPLOAD_DIR + template.getFilename());
        if (!Files.exists(path)) return ResponseEntity.notFound().build();

        ByteArrayResource resource = new ByteArrayResource(Files.readAllBytes(path));

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(template.getFileType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline;filename=\"" + template.getOriginalName() + "\"")
                .body(resource);
    }

    @GetMapping("/all")
    public List<Template> getAllTemplates() {
        return templateRepository.findAll();
    }
}


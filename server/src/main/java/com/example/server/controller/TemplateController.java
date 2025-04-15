//package com.example.server.controller;
//
//import com.example.server.model.Template;
//import com.example.server.repo.TemplateRepo;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.core.io.ByteArrayResource;
//import org.springframework.core.io.Resource;
//import org.springframework.http.HttpHeaders;
//import org.springframework.http.MediaType;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.multipart.MultipartFile;
//
//
//
//import java.io.IOException;
//import java.nio.file.*;
//import java.util.List;
//import java.util.Optional;
//import java.util.UUID;
//
//@RestController
//@RequestMapping("/api/templates")
//public class TemplateController {
//
//    @Autowired
//    private TemplateRepo templateRepository;
//
//    private final String UPLOAD_DIR = "templates/";
//
//    // ✅ Upload template
//    @PostMapping("/upload")
//    public ResponseEntity<Template> uploadTemplate(
//            @RequestParam("file") MultipartFile file,
//            @RequestParam("uploadedBy") String uploadedBy) throws IOException {
//
//        String originalName = file.getOriginalFilename();
//        String fileType = file.getContentType();
//        String storedName = UUID.randomUUID() + "_" + originalName;
//
//        // Save original template file
//        Path path = Paths.get(UPLOAD_DIR + storedName);
//        Files.createDirectories(path.getParent());
//        Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
//
//        // Initialize template entity
//        Template template = new Template();
//        template.setFilename(storedName);
//        template.setOriginalName(originalName);
//        template.setFileType(fileType);
//        template.setUploadedBy(uploadedBy);
//        template.setDefaultTemplate(false); // initially not default
//
//        // Save template to DB
//        Template saved = templateRepository.save(template);
//        return ResponseEntity.ok(saved);
//    }
//
//    // ✅ Get template content
//    @GetMapping("/{id}")
//    public ResponseEntity<Resource> getTemplate(@PathVariable Long id) throws IOException {
//        Template template = templateRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Template not found"));
//
//        Path path = Paths.get(UPLOAD_DIR + template.getFilename());
//        if (!Files.exists(path)) return ResponseEntity.notFound().build();
//
//        ByteArrayResource resource = new ByteArrayResource(Files.readAllBytes(path));
//
//        return ResponseEntity.ok()
//                .contentType(MediaType.parseMediaType(template.getFileType()))
//                .header(HttpHeaders.CONTENT_DISPOSITION, "inline;filename=\"" + template.getOriginalName() + "\"")
//                .body(resource);
//    }
//
//    // ✅ Get all templates
//    @GetMapping
//    public List<Template> getAllTemplates() {
//        return templateRepository.findAll();
//    }
//
//    // ✅ Delete template
//    @DeleteMapping("/{id}")
//    public ResponseEntity<String> deleteTemplate(@PathVariable Long id) throws IOException {
//        Optional<Template> optional = templateRepository.findById(id);
//        if (optional.isEmpty()) return ResponseEntity.notFound().build();
//
//        Template template = optional.get();
//        Path path = Paths.get(UPLOAD_DIR + template.getFilename());
//        if (Files.exists(path)) Files.delete(path);
//
//        templateRepository.delete(template);
//        return ResponseEntity.ok("Template deleted successfully");
//    }
//
//    // ✅ Rename template
//    @PutMapping("/rename/{id}")
//    public ResponseEntity<Template> renameTemplate(@PathVariable Long id, @RequestBody RenameRequest request) {
//        Template template = templateRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Template not found"));
//
//        template.setOriginalName(request.getNewName());
//        Template updated = templateRepository.save(template);
//        return ResponseEntity.ok(updated);
//    }
//
//    // ✅ Set default template
//    @PostMapping("/default/{id}")
//    public ResponseEntity<Template> setDefaultTemplate(@PathVariable Long id) {
//        Template selected = templateRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Template not found"));
//
//        // Unset existing default if exists
//        templateRepository.findAll().forEach(t -> {
//            if (Boolean.TRUE.equals(t.getDefaultTemplate())) {
//                t.setDefaultTemplate(false);
//                templateRepository.save(t);
//            }
//        });
//
//        selected.setDefaultTemplate(true);
//        templateRepository.save(selected);
//        return ResponseEntity.ok(selected);
//    }
//
//
//
//
//    @GetMapping("/default")
//    public ResponseEntity<Resource> getDefaultTemplate() throws IOException {
//        // Find the default template
//        Optional<Template> optional = templateRepository.findAll().stream()
//                .filter(Template::getDefaultTemplate)
//                .findFirst();
//
//        // If no default template found, return 404
//        if (optional.isEmpty()) {
//            return ResponseEntity.notFound().build();
//        }
//
//        Template template = optional.get();
//
//        // Get the path of the file
//        Path path = Paths.get(UPLOAD_DIR + template.getFilename());
//
//        // If the file doesn't exist, return 404
//        if (!Files.exists(path)) {
//            return ResponseEntity.notFound().build();
//        }
//
//        // Create a resource from the file
//        ByteArrayResource resource = new ByteArrayResource(Files.readAllBytes(path));
//
//        // Return the file as a response
//        return ResponseEntity.ok()
//                .contentType(MediaType.parseMediaType(template.getFileType())) // Get file type from the template
//                .header(HttpHeaders.CONTENT_DISPOSITION, "inline;filename=\"" + template.getOriginalName() + "\"")
//                .body(resource);
//    }
//
//
//
//
//
//    // DTO class for rename
//    public static class RenameRequest {
//        private String newName;
//        public String getNewName() { return newName; }
//        public void setNewName(String newName) { this.newName = newName; }
//    }
//}



package com.example.server.controller;

import com.example.server.model.Template;
import com.example.server.repo.TemplateRepo;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/templates")
public class TemplateController {

    @Autowired
    private TemplateRepo templateRepository;

    private final String UPLOAD_DIR = "templates/";

    // ✅ Upload template (from Cloudinary)
    @PostMapping("/upload")
    public ResponseEntity<Template> uploadTemplate(
            @RequestParam("fileurl") String fileurl,
            @RequestParam("uploadedBy") String uploadedBy,
            @RequestParam("originalName") String originalName) {

        // You can optionally download and store locally, or just keep Cloudinary URL
        Template template = new Template();
        template.setFilename(fileurl); // Cloudinary URL saved as filename
        template.setOriginalName(originalName);
        template.setUploadedBy(uploadedBy);
        template.setFileType("image/jpeg"); // or dynamically set if passed
        template.setDefaultTemplate(false);

        Template saved = templateRepository.save(template);
        return ResponseEntity.ok(saved);
    }

    // ✅ Get template content
    @GetMapping("/{id}")
    public ResponseEntity<String> getTemplate(@PathVariable Long id) {
        Template template = templateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Template not found"));
        return ResponseEntity.ok(template.getFilename()); // returns Cloudinary URL
    }

    // ✅ Get all templates
    @GetMapping
    public List<Template> getAllTemplates() {
        return templateRepository.findAll();
    }

    // ✅ Delete template
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTemplate(@PathVariable Long id) {
        Optional<Template> optional = templateRepository.findById(id);
        if (optional.isEmpty()) return ResponseEntity.notFound().build();

        templateRepository.delete(optional.get());
        return ResponseEntity.ok("Template deleted successfully");
    }

    // ✅ Rename template
    @PutMapping("/rename/{id}")
    public ResponseEntity<Template> renameTemplate(@PathVariable Long id, @RequestBody RenameRequest request) {
        Template template = templateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Template not found"));

        template.setOriginalName(request.getNewName());
        Template updated = templateRepository.save(template);
        return ResponseEntity.ok(updated);
    }

    // ✅ Set default template
    @PostMapping("/default/{id}")
    public ResponseEntity<Template> setDefaultTemplate(@PathVariable Long id) {
        Template selected = templateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Template not found"));

        // Unset previous default
        templateRepository.findAll().forEach(t -> {
            if (Boolean.TRUE.equals(t.getDefaultTemplate())) {
                t.setDefaultTemplate(false);
                templateRepository.save(t);
            }
        });

        selected.setDefaultTemplate(true);
        templateRepository.save(selected);
        return ResponseEntity.ok(selected);
    }

    // ✅ Get default template
    @GetMapping("/default")
    public ResponseEntity<String> getDefaultTemplate() {
        Optional<Template> optional = templateRepository.findAll().stream()
                .filter(Template::getDefaultTemplate)
                .findFirst();

        if (optional.isEmpty()) return ResponseEntity.notFound().build();

        return ResponseEntity.ok(optional.get().getFilename());
    }

    // DTO for renaming
    @Data
    public static class RenameRequest {
        private String newName;
    }
}


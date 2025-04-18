package com.example.server.controller;

import com.example.server.dto.Response;
import com.example.server.model.Users;
import com.example.server.service.NotificationService;
import com.example.server.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<Response> getUserNotifications() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Users user = userService.getUserByEmail(auth.getName());

        return ResponseEntity.ok(
                Response.builder()
                        .status(200)
                        .message("Notifications fetched successfully")
                        .notifications(notificationService.getUserNotifications(user))
                        .build()
        );
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Response> getUnreadCount() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Users user = userService.getUserByEmail(auth.getName());

        Long unreadCount = notificationService.getUnreadCount(user);

        return ResponseEntity.ok(
                Response.builder()
                        .status(200)
                        .message("Unread count fetched successfully")
                        .count(unreadCount) // Using the count field
                        .build()
        );
    }

    @PostMapping("/{id}/read")
    public ResponseEntity<Response> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok(
                Response.builder()
                        .status(200)
                        .message("Notification marked as read")
                        .build()
        );
    }

    @PostMapping("/mark-all-read")
    public ResponseEntity<Response> markAllAsRead() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Users user = userService.getUserByEmail(auth.getName());

        notificationService.markAllAsRead(user);
        return ResponseEntity.ok(
                Response.builder()
                        .status(200)
                        .message("All notifications marked as read")
                        .build()
        );
    }
}

package com.example.server.service;

import com.example.server.dto.NotificationDTO;
import com.example.server.model.Notification;
import com.example.server.model.Users;
import com.example.server.repo.NotificationRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepo notificationRepository;

    public void createNotification(Users user, String message, String type) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setMessage(message);
        notification.setType(type);

        notificationRepository.save(notification);

    }

    @Transactional
    public List<NotificationDTO> getUserNotifications(Users user) {
        return notificationRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private NotificationDTO convertToDTO(Notification notification) {
        return NotificationDTO.builder()
                .id(notification.getId())
                .message(notification.getMessage())
                .type(notification.getType())
                .readStatus(notification.isReadStatus())
                .createdAt(notification.getCreatedAt())
                .build();
    }

    @Transactional
    public void markAsRead(Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(notification -> {
            notification.setReadStatus(true);
            notificationRepository.save(notification);
        });
    }

    public Long getUnreadCount(Users user) {
        return notificationRepository.countByUserAndReadStatusFalse(user);
    }

    @Transactional
    public void markAllAsRead(Users user) {
        List<Notification> unreadNotifications = notificationRepository.findByUserAndReadStatusFalse(user);

        if (!unreadNotifications.isEmpty()) {
            unreadNotifications.forEach(notification -> {
                notification.setReadStatus(true);
                notificationRepository.save(notification);
            });

        }
    }

}
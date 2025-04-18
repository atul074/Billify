package com.example.server.service;

import com.example.server.model.Notification;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WebSocketService {
    private final SimpMessagingTemplate messagingTemplate;

    public void sendNotification(String userEmail, Notification notification) {
        messagingTemplate.convertAndSendToUser(
                userEmail,
                "/queue/notifications",
                notification
        );
    }
}
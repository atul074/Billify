package com.example.server.service;

import com.example.server.model.Notification;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

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

    public void sendNotificationUpdate(String userEmail, String updateType) {
        Map<String, String> payload = new HashMap<>();
        payload.put("type", updateType);
        payload.put("message", "All notifications marked as read");

        messagingTemplate.convertAndSendToUser(
                userEmail,
                "/queue/notifications-update",
                payload
        );
    }
}
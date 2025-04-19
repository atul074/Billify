package com.example.server.controller;

import com.example.server.dto.NotificationDTO;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class NotificationWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;

    private static final String NOTIFICATION_TOPIC = "/topic/notifications";

    public NotificationWebSocketController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void sendNotification(NotificationDTO notificationDTO) {
        System.out.println(notificationDTO);
        messagingTemplate.convertAndSend(NOTIFICATION_TOPIC, notificationDTO);
    }


}

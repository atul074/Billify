package com.example.server.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class NotificationDTO {
    private Long id;
    private String message;
    private String type;
    private boolean readStatus;
    private LocalDateTime createdAt;
}
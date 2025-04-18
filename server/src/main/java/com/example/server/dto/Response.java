package com.example.server.dto;

import com.example.server.model.Users;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Response {

    private int status;
    private String message;


    private UserDTO user;
    private List<UserDTO> users;

    private ProductDTO product;
    private List<ProductDTO> products;

    private TransactionDTO transaction;
    private List<TransactionDTO> transactions;

    private NotificationDTO notification;
    private List<NotificationDTO> notifications;

    private Long count;

    private final LocalDateTime timestamp= LocalDateTime.now();







}

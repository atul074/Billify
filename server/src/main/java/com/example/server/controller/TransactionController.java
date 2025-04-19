package com.example.server.controller;


import com.example.server.dto.NotificationDTO;
import com.example.server.dto.Response;
import com.example.server.dto.TransactionRequest;
import com.example.server.model.Notification;
import com.example.server.model.Users;
import com.example.server.service.NotificationService;
import com.example.server.service.TransactionService;
import com.example.server.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;
    private final NotificationService notificationService;
    private final UserService userService;
    private final NotificationWebSocketController notificationWebSocketController;

    @PostMapping("/purchase")
    public ResponseEntity<Response> purchaseInventory(@RequestBody @Valid TransactionRequest transactionRequest) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Users currentUser = userService.getUserByEmail(auth.getName());

        ResponseEntity<Response> response= ResponseEntity.ok(transactionService.purchase(transactionRequest));

        // Get all Users entities instead of DTOs
        List<Users> allUsers = userService.getAllUsers();

        // Send notifications to all users
        allUsers.forEach(user -> {
            Notification notification =notificationService.createNotification(
                    user, // Now passing the User entity
                    "New purchase made by " + currentUser.getUsername(),
                    "PURCHASE"
            );
            // Convert to DTO and send via WebSocket
            NotificationDTO notificationDTO = NotificationDTO.builder()
                    .id(notification.getId())
                    .message(notification.getMessage())
                    .type(notification.getType())
                    .readStatus(notification.isReadStatus())
                    .createdAt(notification.getCreatedAt())
                    .build();

            notificationWebSocketController.sendNotification(notificationDTO, user.getUser_id());

        });


        return response;

    }

    @PostMapping("/sell")
    public ResponseEntity<Response> makeSale(@RequestBody @Valid TransactionRequest transactionRequest) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Users currentUser = userService.getUserByEmail(auth.getName());


        ResponseEntity<Response> response = ResponseEntity.ok(transactionService.sell(transactionRequest));
        // Get all Users entities instead of DTOs
        List<Users> allUsers = userService.getAllUsers();

        // Send notifications to all users
        allUsers.forEach(user -> {
            Notification notification=notificationService.createNotification(
                    user, // Now passing the User entity
                    "New sale made by " + currentUser.getUsername(),
                    "SALE"
            );

            // Convert to DTO and send via WebSocket
            NotificationDTO notificationDTO = NotificationDTO.builder()
                    .id(notification.getId())
                    .message(notification.getMessage())
                    .type(notification.getType())
                    .readStatus(notification.isReadStatus())
                    .createdAt(notification.getCreatedAt())
                    .build();
            System.out.println(user);

            notificationWebSocketController.sendNotification(notificationDTO, user.getUser_id());
        });

        return response;
    }

    @GetMapping("/all")
    public ResponseEntity<Response> getAllTransactions() {

        return ResponseEntity.ok(transactionService.getAllTransactions());
    }


    @GetMapping("/{id}")
    public ResponseEntity<Response> getTransactionById(@PathVariable Long id) {
        return ResponseEntity.ok(transactionService.getAllTransactionById(id));
    }

    @GetMapping("/by-month-year")
    public ResponseEntity<Response> getTransactionByMonthAndYear(
            @RequestParam int month,
            @RequestParam int year) {

        return ResponseEntity.ok(transactionService.getAllTransactionByMonthAndYear(month, year));
    }

}

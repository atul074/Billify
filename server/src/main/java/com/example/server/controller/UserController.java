package com.example.server.controller;
import com.example.server.dto.Response;
import com.example.server.dto.UserDTO;
import com.example.server.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/users")
    @ResponseBody
    public List<UserDTO> getAllUsers(){
        return userService.getAllUsersDTO();
    }

    @GetMapping("/transactions/{userId}")
    public ResponseEntity<Response> getUserAndTransactions(@PathVariable int userId) {
        return ResponseEntity.ok(userService.getUserTransactions(userId));
    }
}

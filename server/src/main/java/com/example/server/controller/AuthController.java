package com.example.server.controller;
import com.example.server.model.Users;
import com.example.server.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin
@RestController
public class AuthController {


    @Autowired
    private UserService userService;



    @PostMapping("/login")
    @ResponseBody
    public Map<String, Object> login(@RequestBody Users user) {
        System.out.println("the incoming object is "+user);
        return userService.verify(user);
    }



    @PostMapping("/register")
    @ResponseBody
    public Users register(@RequestBody  Users user)
    {
        System.out.println("the incoming object is= "+user);
        return  userService.addUser(user);
    }
}

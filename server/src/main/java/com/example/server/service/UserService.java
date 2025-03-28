package com.example.server.service;



import com.example.server.dto.UserDTO;
import com.example.server.model.Users;
import com.example.server.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UserService {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JWTService jwtService;

    @Autowired
    private UserRepo repo;

    private final int saltRounds=12;

    private BCryptPasswordEncoder encoder=new BCryptPasswordEncoder(saltRounds);

    public Users addUser(Users user) {
        System.out.println(user);
        String email=user.getEmail();
        String username=user.getUsername();
        user.setUsername(username);
        user.setPassword(encoder.encode(user.getPassword()));
        Users savedUser=repo.save(user);
        System.out.println("savedUser= "+savedUser);
        return savedUser;
    }

    public Map<String,Object> verify(Users user) {
        Authentication authentication=
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(user.getEmail(),user.getPassword())
                );
        if(authentication.isAuthenticated()) {
//            return jwtService.generateToken(user.getUsername());
            String token=jwtService.generateToken(user.getEmail());
            Users authenticatedUser=repo.findByEmail(user.getEmail());
            System.out.println(token+"token");
            System.out.println(authenticatedUser);
            UserDTO userDTO=new UserDTO();
            userDTO.setUsername(authenticatedUser.getUsername());
            userDTO.setEmail(authenticatedUser.getEmail());
            userDTO.setPhoneNo(authenticatedUser.getPhoneNo());
            userDTO.setAddress(authenticatedUser.getAddress());
            userDTO.setUser_id(authenticatedUser.getUser_id());

            Map<String, Object> res=new HashMap<>();
            res.put("token",token);
            res.put("userDTO",userDTO);
            return res;
        }
        else
            return Collections.singletonMap("Message","failure");
    }

    public List<UserDTO> getAllUsers() {

        List<Users>  allUsers =repo.findAll();
        List<UserDTO> allUsersDTO=new ArrayList<>();
        for (int i=0;i<allUsers.size();i++){
            UserDTO userDTO=new UserDTO();
            userDTO.setUsername(allUsers.get(i).getUsername());
            userDTO.setEmail(allUsers.get(i).getEmail());
            userDTO.setUser_id(allUsers.get(i).getUser_id());
            userDTO.setPhoneNo(allUsers.get(i).getPhoneNo());
            userDTO.setAddress(allUsers.get(i).getAddress());
            allUsersDTO.add(userDTO);
        }
        return allUsersDTO;
    }
}

package ru.kata.spring.boot_security.demo.service;

import org.springframework.security.core.userdetails.UserDetailsService;
import ru.kata.spring.boot_security.demo.model.User;

import java.util.List;

public interface UserService extends UserDetailsService {

    User getUserById(Long id);

    void addUser(User user);

    void updateUserById(User user);


    List<User> getAllUsers();

    User getUserByUsername(String username);

    void deleteUserById(Long id);
}


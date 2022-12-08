package ru.kata.spring.boot_security.demo.service;

import org.springframework.security.core.userdetails.UserDetailsService;
import ru.kata.spring.boot_security.demo.model.User;

import java.util.List;

public interface UserService extends UserDetailsService {

    User getUserById(Long id);

    boolean addUser(User user);


    List<User> getAllUsers();

    User getUserByName(String username);


    boolean deleteUserById(Long id);

    boolean updateUser(User user);
}


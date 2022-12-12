package ru.kata.spring.boot_security.demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.util.List;

@RestController
public class AdminRestController {

    private final UserService userService;

    public AdminRestController(UserService userService) {
        this.userService = userService;
    }


    @GetMapping("/main")
    public ModelAndView getMainPage() {
        return new ModelAndView("main");
    }

    @GetMapping("api/admin")
    public ResponseEntity<List<User>> getInfoUsersList() {
        List<User> userList = userService.getAllUsers();
        return ResponseEntity.ok().body(userList); // 200
    }

    @GetMapping("api/admin/{id}")
    public ResponseEntity<User> getUserById(@PathVariable long id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok().body(user);
    }

    @PostMapping("api/admin")
    public ResponseEntity<User> getSaveUserForm(@RequestBody User user) {
        userService.addUser(user);
        return ResponseEntity.ok().body(user);
    }

    @PutMapping("api/admin")
    public ResponseEntity<User> getUpdateUserForm(@RequestBody User user) {
        userService.updateUser(user);
        return ResponseEntity.ok().body(user); // 400
    }

    @DeleteMapping("api/admin/{id}")
    public ResponseEntity<Long> getRemoveUserForm(@PathVariable long id) {
        userService.deleteUserById(id);
        return ResponseEntity.ok().body(id); // 404
    }
}

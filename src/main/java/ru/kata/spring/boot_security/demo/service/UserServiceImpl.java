package ru.kata.spring.boot_security.demo.service;

import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.repository.RoleRepository;
import ru.kata.spring.boot_security.demo.repository.UserRepository;

import java.security.InvalidParameterException;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class UserServiceImpl implements UserService{

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, RoleRepository roleRepository, @Lazy PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public User findById(Long id)  {return userRepository.findById(id).orElse(null);}

    @Override
    public List<User> findAll() {return userRepository.findAll();}

    @Override
    @Transactional
    public void saveUser(User user, String[] selectedRoles) {
        User userDB = userRepository.findByUsername(user.getUsername());
        if (userDB == null) {
            String encodedPassword = new BCryptPasswordEncoder().encode(user.getPassword());
            user.setPassword(encodedPassword);
            Set<Role> roles = new HashSet<>();
            Arrays.stream(selectedRoles)
                    .forEach(a -> roles.add(roleRepository.findRoleByRole(a)));
            user.setRoles(roles);
            userRepository.save(user);
        }
    }

    @Override
    @Transactional
    public void updateUser(User user, String[] selectedRoles) {
        if (userRepository.findByUsername(user.getUsername()) != null &&
                !userRepository.findByUsername(user.getUsername()).getId().equals(user.getId())) {
            throw new InvalidParameterException("Cannot save user, such email already exists in the database: "
                    + user.getUsername());
        }
        if (user.getPassword().isEmpty()) {
            user.setPassword(userRepository.findById(user.getId()).get().getPassword());
        } else {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        Set<Role> roles = new HashSet<>();
        Arrays.stream(selectedRoles)
                .forEach(x -> roles.add(roleRepository.findRoleByRole(x)));
        user.setRoles(roles);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public User getUserByUsername(String name) {
        return userRepository.findByUsername(name);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException(String.format("User for '%s' not exists ", username));
        }
        return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), user.getAuthorities());
    }
}

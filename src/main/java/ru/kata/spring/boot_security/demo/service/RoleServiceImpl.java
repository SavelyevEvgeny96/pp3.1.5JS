package ru.kata.spring.boot_security.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.repository.RoleRepository;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepo;

    @Autowired
    public RoleServiceImpl(RoleRepository roleRepo) {
        this.roleRepo = roleRepo;
    }

    @Transactional
    public void addRole(Role role) {
        roleRepo.save(role);
    }

    public Set<Role> findRollsById(String roleId) {
        Set<Role> roles = new HashSet<>();
        for (Role role : roleRepo.findAll()) {
            if (roleId.contains(role.getId().toString())) {
                roles.add(role);
            }
        }
        return roles;
    }

    public List<Role> getAllRoles() {return roleRepo.findAll();
    }

}


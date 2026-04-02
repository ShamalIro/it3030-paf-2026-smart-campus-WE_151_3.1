package com.smartcampus.backend.service;

import com.smartcampus.backend.entity.User;
import com.smartcampus.backend.enums.Role;
import com.smartcampus.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    // Get all users - Admin only
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Get user by ID
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Get user by email
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Update user role - Admin only
    public User updateUserRole(Long id, Role role) {
        User user = getUserById(id);
        user.setRole(role);
        return userRepository.save(user);
    }

    // Delete user - Admin only
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
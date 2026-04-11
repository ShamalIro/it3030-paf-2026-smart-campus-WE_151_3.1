package com.smartcampus.backend.controller;

import com.smartcampus.backend.entity.User;
import com.smartcampus.backend.enums.Role;
import com.smartcampus.backend.security.JwtUtil;
import com.smartcampus.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    //  POST login
    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String password = request.get("password");

            if (email == null || password == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Email and password are required."));
            }

            // Find user
            User user = userService.getUserByEmail(email);

            // Check password
            if (!passwordEncoder.matches(password, user.getPassword())) {
                return ResponseEntity.status(401)
                        .body(Map.of("message", "Invalid credentials."));
            }

            // Generate JWT
            String token = jwtUtil.generateToken(
                    user.getEmail(),
                    user.getRole().name()
            );

            return ResponseEntity.ok(Map.of("token", token));

        } catch (RuntimeException e) {
            return ResponseEntity.status(401)
                    .body(Map.of("message", "Invalid credentials."));
        }
    }

    // POST register
    @PostMapping("/auth/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        try {
            String name = request.get("name");
            String email = request.get("email");
            String password = request.get("password");

            if (name == null || email == null || password == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "All fields are required."));
            }

            userService.registerUser(name, email, password);
            return ResponseEntity.status(201)
                    .body(Map.of("message", "Account created successfully."));

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // GET current logged in user
    @GetMapping("/auth/me")
    public ResponseEntity<User> getCurrentUser(
            @AuthenticationPrincipal String email) {
        User user = userService.getUserByEmail(email);
        return ResponseEntity.ok(user);
    }

    // GET all users - Admin only
    @GetMapping("/admin/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // PATCH update user role - Admin only
    @PatchMapping("/admin/users/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> updateUserRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        Role role = Role.valueOf(request.get("role"));
        User updated = userService.updateUserRole(id, role);
        return ResponseEntity.ok(updated);
    }

    // DELETE user - Admin only
    @DeleteMapping("/admin/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    // 🔍 DEBUG ENDPOINT - Check all admins in system
    @GetMapping("/debug/admins")
    public ResponseEntity<?> debugAdmins() {
        List<User> admins = userService.getAllAdmins();
        return ResponseEntity.ok(Map.of(
            "adminCount", admins.size(),
            "admins", admins.stream()
                .map(a -> Map.of("id", a.getId(), "name", a.getName(), "email", a.getEmail(), "role", a.getRole()))
                .toList()
        ));
    }
}
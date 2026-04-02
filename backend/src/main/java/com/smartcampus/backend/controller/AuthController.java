package com.smartcampus.backend.controller;

import com.smartcampus.backend.entity.User;
import com.smartcampus.backend.enums.Role;
import com.smartcampus.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    // GET current logged in user
    @GetMapping("/auth/me")
    public ResponseEntity<User> getCurrentUser(
            @AuthenticationPrincipal OAuth2User oAuth2User) {
        String email = oAuth2User.getAttribute("email");
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
}
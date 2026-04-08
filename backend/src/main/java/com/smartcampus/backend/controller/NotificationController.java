package com.smartcampus.backend.controller;

import com.smartcampus.backend.entity.Notification;
import com.smartcampus.backend.entity.User;
import com.smartcampus.backend.enums.NotificationType;
import com.smartcampus.backend.service.NotificationService;
import com.smartcampus.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final UserService userService;

    // GET all notifications for current user
    @GetMapping
    public ResponseEntity<List<Notification>> getMyNotifications(
            @AuthenticationPrincipal String email) {
        return ResponseEntity.ok(
                notificationService.getUserNotifications(email));
    }

    // GET unread notifications only
    @GetMapping("/unread")
    public ResponseEntity<List<Notification>> getUnreadNotifications(
            @AuthenticationPrincipal String email) {
        return ResponseEntity.ok(
                notificationService.getUnreadNotifications(email));
    }

    // GET unread count
    @GetMapping("/unread/count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(
            @AuthenticationPrincipal String email) {
        long count = notificationService.getUnreadCount(email);
        return ResponseEntity.ok(Map.of("count", count));
    }

    // PATCH mark single notification as read
    @PatchMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(
            @PathVariable Long id,
            @AuthenticationPrincipal String email) {
        return ResponseEntity.ok(
                notificationService.markAsRead(id, email));
    }

    // PATCH mark all notifications as read
    @PatchMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(
            @AuthenticationPrincipal String email) {
        notificationService.markAllAsRead(email);
        return ResponseEntity.noContent().build();
    }

    // DELETE notification
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(
            @PathVariable Long id,
            @AuthenticationPrincipal String email) {
        notificationService.deleteNotification(id, email);
        return ResponseEntity.noContent().build();
    }

    // POST create notification - Admin or internal use
    @PostMapping
    public ResponseEntity<Notification> createNotification(
            @RequestBody Map<String, String> request,
            @AuthenticationPrincipal String email) {
        User user = userService.getUserByEmail(
                request.get("userEmail"));
        NotificationType type = NotificationType.valueOf(
                request.get("type"));
        String message = request.get("message");
        return ResponseEntity.ok(
                notificationService.createNotification(user, type, message));
    }
}
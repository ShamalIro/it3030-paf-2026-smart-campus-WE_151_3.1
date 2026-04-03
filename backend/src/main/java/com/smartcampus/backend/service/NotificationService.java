package com.smartcampus.backend.service;

import com.smartcampus.backend.entity.Notification;
import com.smartcampus.backend.entity.User;
import com.smartcampus.backend.enums.NotificationType;
import com.smartcampus.backend.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserService userService;

    // Create notification - called internally by other modules
    public Notification createNotification(User user,
                                           NotificationType type,
                                           String message) {
        Notification notification = Notification.builder()
                .user(user)
                .type(type)
                .message(message)
                .isRead(false)
                .build();
        return notificationRepository.save(notification);
    }

    // Get all notifications for current user
    public List<Notification> getUserNotifications(String email) {
        User user = userService.getUserByEmail(email);
        return notificationRepository
                .findByUserOrderByCreatedAtDesc(user);
    }

    // Get unread notifications for current user
    public List<Notification> getUnreadNotifications(String email) {
        User user = userService.getUserByEmail(email);
        return notificationRepository
                .findByUserAndIsReadFalseOrderByCreatedAtDesc(user);
    }

    // Get unread notification count
    public long getUnreadCount(String email) {
        User user = userService.getUserByEmail(email);
        return notificationRepository.countByUserAndIsReadFalse(user);
    }

    // Mark notification as read
    public Notification markAsRead(Long id, String email) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Notification not found"));

        // Make sure user owns this notification
        if (!notification.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized");
        }

        notification.setRead(true);
        return notificationRepository.save(notification);
    }

    // Mark all notifications as read
    public void markAllAsRead(String email) {
        User user = userService.getUserByEmail(email);
        List<Notification> unread = notificationRepository
                .findByUserAndIsReadFalseOrderByCreatedAtDesc(user);
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }

    // Delete notification
    public void deleteNotification(Long id, String email) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Notification not found"));

        // Make sure user owns this notification
        if (!notification.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized");
        }

        notificationRepository.delete(notification);
    }
}
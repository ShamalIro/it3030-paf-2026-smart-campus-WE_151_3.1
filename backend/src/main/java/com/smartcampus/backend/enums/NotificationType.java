package com.smartcampus.backend.enums;

public enum NotificationType {
    // ✅ Booking notifications
    BOOKING_UPDATE,
    BOOKING_APPROVED,
    BOOKING_REJECTED,
    BOOKING_CANCELLED,

    // ✅ Ticket notifications
    TICKET_UPDATE,
    TICKET_STATUS_CHANGED,
    TICKET_ASSIGNED,

    // ✅ Comment notifications
    COMMENT_ADDED,
    NEW_COMMENT,

    // ✅ General
    GENERAL
}
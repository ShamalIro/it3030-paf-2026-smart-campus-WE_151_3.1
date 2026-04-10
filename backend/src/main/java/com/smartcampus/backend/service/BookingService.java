package com.smartcampus.backend.service;

import com.smartcampus.backend.entity.Booking;
import com.smartcampus.backend.entity.User;
import com.smartcampus.backend.enums.BookingStatus;
import com.smartcampus.backend.enums.NotificationType;
import com.smartcampus.backend.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final NotificationService notificationService;
    private final UserService userService;

    // Create booking
    public Booking createBooking(Booking booking, User user) {
        // Check for conflicts
        List<Booking> conflicts = bookingRepository.findConflicts(
                booking.getFacilityId(),
                booking.getDate(),
                booking.getStartTime(),
                booking.getEndTime()
        );
        if (!conflicts.isEmpty()) {
            throw new RuntimeException(
                    "This facility is already booked for the selected time.");
        }

        booking.setUserId(user.getId());
        booking.setUserName(user.getName());
        booking.setUserEmail(user.getEmail());
        booking.setStatus(BookingStatus.PENDING);
        return bookingRepository.save(booking);
    }

    // Get my bookings
    public List<Booking> getMyBookings(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    // Get all bookings - ADMIN
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // Get booking by ID
    public Booking getById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    // Approve booking
    public Booking approveBooking(Long id) {
        Booking booking = getById(id);
        booking.setStatus(BookingStatus.APPROVED);
        bookingRepository.save(booking);

        // ✅ Notify user
        notificationService.createNotification(
                booking.getUserId(),
                "Your booking for " + booking.getFacilityName() +
                        " on " + booking.getDate() + " has been APPROVED ✅",
                NotificationType.BOOKING_UPDATE
        );
        return booking;
    }

    // Reject booking
    public Booking rejectBooking(Long id, String reason) {
        Booking booking = getById(id);
        booking.setStatus(BookingStatus.REJECTED);
        booking.setRejectionReason(reason);
        bookingRepository.save(booking);

        // ✅ Notify user
        notificationService.createNotification(
                booking.getUserId(),
                "Your booking for " + booking.getFacilityName() +
                        " has been REJECTED ❌. Reason: " + reason,
                NotificationType.BOOKING_UPDATE
        );
        return booking;
    }

    // Cancel booking
    public Booking cancelBooking(Long id, Long userId) {
        Booking booking = getById(id);
        if (!booking.getUserId().equals(userId)) {
            throw new RuntimeException(
                    "Not authorized to cancel this booking.");
        }
        booking.setStatus(BookingStatus.CANCELLED);
        return bookingRepository.save(booking);
    }
}
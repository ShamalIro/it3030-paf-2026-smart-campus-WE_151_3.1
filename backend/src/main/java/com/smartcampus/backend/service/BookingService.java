package com.smartcampus.backend.service;

import com.smartcampus.backend.dto.BookingRequestDTO;
import com.smartcampus.backend.dto.BookingResponseDTO;
import com.smartcampus.backend.entity.Booking;
import com.smartcampus.backend.entity.User;
import com.smartcampus.backend.enums.BookingStatus;
import com.smartcampus.backend.exception.BookingException;
import com.smartcampus.backend.mapper.BookingMapper;
import com.smartcampus.backend.repository.BookingRepository;
import com.smartcampus.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    // Create a new booking
    public BookingResponseDTO createBooking(BookingRequestDTO request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new BookingException("User not found"));

        // Validate time range
        if (request.getEndTime().isBefore(request.getStartTime()) || request.getEndTime().equals(request.getStartTime())) {
            throw new BookingException("End time must be after start time");
        }

        // Check for scheduling conflicts
        List<Booking> conflicts = bookingRepository.findConflictingBookings(
                request.getResourceName(),
                request.getBookingDate(),
                request.getStartTime(),
                request.getEndTime());

        if (!conflicts.isEmpty()) {
            throw new BookingException("Scheduling conflict: this resource is already booked for the selected time range");
        }

        Booking booking = BookingMapper.toEntity(request, user);
        Booking saved = bookingRepository.save(booking);
        return BookingMapper.toDTO(saved);
    }

    // Get current user's bookings
    public List<BookingResponseDTO> getMyBookings(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new BookingException("User not found"));

        return bookingRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(BookingMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Get all bookings (Admin)
    public List<BookingResponseDTO> getAllBookings() {
        return bookingRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(BookingMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Get bookings by status (Admin)
    public List<BookingResponseDTO> getBookingsByStatus(BookingStatus status) {
        return bookingRepository.findByStatusOrderByCreatedAtDesc(status)
                .stream()
                .map(BookingMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Approve a booking (Admin)
    public BookingResponseDTO approveBooking(Long id, String remarks) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new BookingException("Booking not found"));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new BookingException("Only PENDING bookings can be approved");
        }

        booking.setStatus(BookingStatus.APPROVED);
        booking.setAdminRemarks(remarks);
        return BookingMapper.toDTO(bookingRepository.save(booking));
    }

    // Reject a booking (Admin)
    public BookingResponseDTO rejectBooking(Long id, String remarks) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new BookingException("Booking not found"));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new BookingException("Only PENDING bookings can be rejected");
        }

        booking.setStatus(BookingStatus.REJECTED);
        booking.setAdminRemarks(remarks);
        return BookingMapper.toDTO(bookingRepository.save(booking));
    }

    // Cancel a booking (User)
    public BookingResponseDTO cancelBooking(Long id, String userEmail) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new BookingException("Booking not found"));

        if (!booking.getUser().getEmail().equals(userEmail)) {
            throw new BookingException("You can only cancel your own bookings");
        }

        if (booking.getStatus() != BookingStatus.PENDING && booking.getStatus() != BookingStatus.APPROVED) {
            throw new BookingException("Only PENDING or APPROVED bookings can be cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        return BookingMapper.toDTO(bookingRepository.save(booking));
    }

    // Delete a booking (Admin)
    public void deleteBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new BookingException("Booking not found"));
        bookingRepository.delete(booking);
    }
}
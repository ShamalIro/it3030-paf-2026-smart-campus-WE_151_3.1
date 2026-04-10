
package com.smartcampus.backend.controller;

import com.smartcampus.backend.dto.BookingRequestDTO;
import com.smartcampus.backend.dto.BookingResponseDTO;
import com.smartcampus.backend.enums.BookingStatus;
import com.smartcampus.backend.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // POST - Create a booking (any authenticated user)
    @PostMapping("/bookings")
    public ResponseEntity<BookingResponseDTO> createBooking(
            @RequestBody BookingRequestDTO request,
            Authentication authentication) {
        BookingResponseDTO response = bookingService.createBooking(request, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // GET - Get my bookings
    @GetMapping("/bookings/my")
    public ResponseEntity<List<BookingResponseDTO>> getMyBookings(Authentication authentication) {
        return ResponseEntity.ok(bookingService.getMyBookings(authentication.getName()));
    }

    // GET - Get all bookings (Admin)
    @GetMapping("/admin/bookings")
    public ResponseEntity<List<BookingResponseDTO>> getAllBookings(
            @RequestParam(required = false) BookingStatus status) {
        if (status != null) {
            return ResponseEntity.ok(bookingService.getBookingsByStatus(status));
        }
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    // PATCH - Approve a booking (Admin)
    @PatchMapping("/admin/bookings/{id}/approve")
    public ResponseEntity<BookingResponseDTO> approveBooking(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {
        String remarks = (body != null) ? body.get("remarks") : null;
        return ResponseEntity.ok(bookingService.approveBooking(id, remarks));
    }

    // PATCH - Reject a booking (Admin)
    @PatchMapping("/admin/bookings/{id}/reject")
    public ResponseEntity<BookingResponseDTO> rejectBooking(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {
        String remarks = (body != null) ? body.get("remarks") : null;
        return ResponseEntity.ok(bookingService.rejectBooking(id, remarks));
    }

    // PATCH - Cancel a booking (User)
    @PatchMapping("/bookings/{id}/cancel")
    public ResponseEntity<BookingResponseDTO> cancelBooking(
            @PathVariable Long id,
            Authentication authentication) {
        return ResponseEntity.ok(bookingService.cancelBooking(id, authentication.getName()));
    }

    // DELETE - Delete a booking (Admin)
    @DeleteMapping("/admin/bookings/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }
}
package com.smartcampus.backend.repository;

import com.smartcampus.backend.entity.Booking;
import com.smartcampus.backend.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Booking> findAllByOrderByCreatedAtDesc();

    List<Booking> findByStatusOrderByCreatedAtDesc(BookingStatus status);

    @Query("SELECT b FROM Booking b WHERE b.resourceName = :resourceName " +
            "AND b.bookingDate = :bookingDate " +
            "AND b.status IN ('PENDING', 'APPROVED') " +
            "AND b.startTime < :endTime " +
            "AND b.endTime > :startTime")
    List<Booking> findConflictingBookings(
            @Param("resourceName") String resourceName,
            @Param("bookingDate") LocalDate bookingDate,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime);
}
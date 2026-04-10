package com.smartcampus.backend.repository;

import com.smartcampus.backend.entity.Booking;
import com.smartcampus.backend.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserId(Long userId);
    List<Booking> findByStatus(BookingStatus status);
    List<Booking> findByFacilityId(Long facilityId);

    // Conflict check query
    @Query("SELECT b FROM Booking b WHERE b.facilityId = :facilityId " +
            "AND b.date = :date " +
            "AND b.status != 'CANCELLED' " +
            "AND b.status != 'REJECTED' " +
            "AND (b.startTime < :endTime AND b.endTime > :startTime)")
    List<Booking> findConflicts(
            @Param("facilityId") Long facilityId,
            @Param("date") LocalDate date,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime
    );
}
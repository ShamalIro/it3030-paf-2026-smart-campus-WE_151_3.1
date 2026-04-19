package com.smartcampus.backend.repository;

import com.smartcampus.backend.entity.Facility;
import com.smartcampus.backend.enums.FacilityStatus;
import com.smartcampus.backend.enums.FacilityType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FacilityRepository extends JpaRepository<Facility, Long> {
    List<Facility> findByType(FacilityType type);
    List<Facility> findByStatus(FacilityStatus status);
    List<Facility> findByLocationContainingIgnoreCase(String location);
    List<Facility> findByCapacityGreaterThanEqual(Integer capacity);
}
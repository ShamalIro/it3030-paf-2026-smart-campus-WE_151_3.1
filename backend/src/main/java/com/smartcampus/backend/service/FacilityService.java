package com.smartcampus.backend.service;

import com.smartcampus.backend.entity.Facility;
import com.smartcampus.backend.enums.FacilityType;
import com.smartcampus.backend.repository.FacilityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FacilityService {

    @Autowired
    private FacilityRepository facilityRepository;

    public List<Facility> getAllFacilities() {
        return facilityRepository.findAll();
    }

    public Facility getFacilityById(Long id) {
        return facilityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Facility not found"));
    }

    public Facility createFacility(Facility facility) {
        return facilityRepository.save(facility);
    }

    public Facility updateFacility(Long id, Facility updated) {
        Facility existing = getFacilityById(id);
        existing.setName(updated.getName());
        existing.setType(updated.getType());
        existing.setCapacity(updated.getCapacity());
        existing.setLocation(updated.getLocation());
        existing.setAvailabilityWindows(updated.getAvailabilityWindows());
        existing.setStatus(updated.getStatus());
        return facilityRepository.save(existing);
    }

    public void deleteFacility(Long id) {
        facilityRepository.deleteById(id);
    }

    public List<Facility> searchFacilities(String type, String location, Integer capacity) {
        if (type != null) {
            return facilityRepository.findByType(FacilityType.valueOf(type.toUpperCase()));
        }
        if (location != null) {
            return facilityRepository.findByLocationContainingIgnoreCase(location);
        }
        if (capacity != null) {
            return facilityRepository.findByCapacityGreaterThanEqual(capacity);
        }
        return facilityRepository.findAll();
    }
}
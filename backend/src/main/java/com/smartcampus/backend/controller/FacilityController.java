package com.smartcampus.backend.controller;

import com.smartcampus.backend.entity.Facility;
import com.smartcampus.backend.service.FacilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/facilities")
@CrossOrigin(origins = "http://localhost:5173")
public class FacilityController {

    @Autowired
    private FacilityService facilityService;

    @GetMapping
    public ResponseEntity<List<Facility>> getAll() {
        return ResponseEntity.ok(facilityService.getAllFacilities());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Facility> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(facilityService.getFacilityById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Facility>> search(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Integer capacity
    ) {
        return ResponseEntity.ok(facilityService.searchFacilities(type, location, capacity));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Facility> create(@RequestBody Facility facility) {
        return ResponseEntity.status(201).body(facilityService.createFacility(facility));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Facility> update(@PathVariable Long id, @RequestBody Facility facility) {
        return ResponseEntity.ok(facilityService.updateFacility(id, facility));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        facilityService.deleteFacility(id);
        return ResponseEntity.noContent().build();
    }
}
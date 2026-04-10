package com.smartcampus.backend.entity;

import com.smartcampus.backend.enums.FacilityStatus;
import com.smartcampus.backend.enums.FacilityType;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "facilities")
@Data
public class Facility {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Enumerated(EnumType.STRING)
    private FacilityType type;

    private Integer capacity;
    private String location;
    private String availabilityWindows;

    @Enumerated(EnumType.STRING)
    private FacilityStatus status = FacilityStatus.ACTIVE;
}
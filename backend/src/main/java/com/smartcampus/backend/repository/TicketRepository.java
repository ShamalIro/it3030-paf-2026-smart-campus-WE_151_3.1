package com.smartcampus.backend.repository;

import com.smartcampus.backend.entity.Ticket;
import com.smartcampus.backend.entity.User;
import com.smartcampus.backend.enums.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {

    // Find all tickets created by a specific user
    List<Ticket> findByCreatorOrderByCreatedAtDesc(User creator);

    // Find all tickets assigned to a specific technician
    List<Ticket> findByAssignedTechnicianOrderByCreatedAtDesc(User technician);

    // Find all tickets by status
    List<Ticket> findByStatusOrderByCreatedAtDesc(TicketStatus status);

    // Find all tickets ordered by creation date (newest first)
    List<Ticket> findAllByOrderByCreatedAtDesc();
}

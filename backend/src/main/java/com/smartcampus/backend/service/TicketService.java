package com.smartcampus.backend.service;

import com.smartcampus.backend.entity.Ticket;
import com.smartcampus.backend.entity.TicketAttachment;
import com.smartcampus.backend.entity.User;
import com.smartcampus.backend.enums.Role;
import com.smartcampus.backend.enums.TicketStatus;
import com.smartcampus.backend.repository.TicketAttachmentRepository;
import com.smartcampus.backend.repository.TicketRepository;
import com.smartcampus.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final TicketAttachmentRepository attachmentRepository;
    private final UserRepository userRepository;

    @Value("${ticket.upload.dir:uploads/tickets}")
    private String uploadDir;

    // ─── CREATE TICKET ────────────────────────────────────────────────
    public Ticket createTicket(Ticket ticket, String creatorEmail) {
        User creator = userRepository.findByEmail(creatorEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        ticket.setCreator(creator);
        ticket.setStatus(TicketStatus.OPEN);
        return ticketRepository.save(ticket);
    }

    // ─── GET ALL TICKETS (Admin) ──────────────────────────────────────
    public List<Ticket> getAllTickets() {
        return ticketRepository.findAllByOrderByCreatedAtDesc();
    }

    // ─── GET MY TICKETS (User) ────────────────────────────────────────
    public List<Ticket> getMyTickets(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ticketRepository.findByCreatorOrderByCreatedAtDesc(user);
    }

    // ─── GET ASSIGNED TICKETS (Technician) ────────────────────────────
    public List<Ticket> getAssignedTickets(String techEmail) {
        User technician = userRepository.findByEmail(techEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ticketRepository.findByAssignedTechnicianOrderByCreatedAtDesc(technician);
    }

    // ─── GET TICKET BY ID ─────────────────────────────────────────────
    public Ticket getTicketById(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
    }

    // ─── ASSIGN TECHNICIAN (Admin) ────────────────────────────────────
    public Ticket assignTechnician(Long ticketId, Long technicianId) {
        Ticket ticket = getTicketById(ticketId);
        User technician = userRepository.findById(technicianId)
                .orElseThrow(() -> new RuntimeException("Technician not found"));

        if (technician.getRole() != Role.TECHNICIAN) {
            throw new RuntimeException("User is not a technician");
        }

        ticket.setAssignedTechnician(technician);
        // Auto-transition to IN_PROGRESS when technician is assigned
        if (ticket.getStatus() == TicketStatus.OPEN) {
            ticket.setStatus(TicketStatus.IN_PROGRESS);
        }
        return ticketRepository.save(ticket);
    }

    // ─── REJECT TICKET (Admin) ────────────────────────────────────────
    public Ticket rejectTicket(Long ticketId, String reason) {
        Ticket ticket = getTicketById(ticketId);

        if (ticket.getStatus() != TicketStatus.OPEN) {
            throw new RuntimeException("Only OPEN tickets can be rejected");
        }

        ticket.setStatus(TicketStatus.REJECTED);
        ticket.setRejectionReason(reason);
        return ticketRepository.save(ticket);
    }

    // ─── UPDATE STATUS (Technician) ───────────────────────────────────
    public Ticket updateStatus(Long ticketId, TicketStatus newStatus, String techEmail) {
        Ticket ticket = getTicketById(ticketId);
        User technician = userRepository.findByEmail(techEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Verify technician is assigned to this ticket
        if (ticket.getAssignedTechnician() == null ||
                !ticket.getAssignedTechnician().getId().equals(technician.getId())) {
            throw new RuntimeException("You are not assigned to this ticket");
        }

        // Validate status transitions
        validateStatusTransition(ticket.getStatus(), newStatus);

        ticket.setStatus(newStatus);
        return ticketRepository.save(ticket);
    }

    // ─── RESOLVE TICKET (Technician) ──────────────────────────────────
    public Ticket resolveTicket(Long ticketId, String resolutionNotes, String techEmail) {
        Ticket ticket = getTicketById(ticketId);
        User technician = userRepository.findByEmail(techEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Verify technician is assigned to this ticket
        if (ticket.getAssignedTechnician() == null ||
                !ticket.getAssignedTechnician().getId().equals(technician.getId())) {
            throw new RuntimeException("You are not assigned to this ticket");
        }

        if (ticket.getStatus() != TicketStatus.IN_PROGRESS) {
            throw new RuntimeException("Only IN_PROGRESS tickets can be resolved");
        }

        ticket.setStatus(TicketStatus.RESOLVED);
        ticket.setResolutionNotes(resolutionNotes);
        return ticketRepository.save(ticket);
    }

    // ─── UPLOAD ATTACHMENTS ───────────────────────────────────────────
    public List<TicketAttachment> uploadAttachments(Long ticketId, MultipartFile[] files) throws IOException {
        Ticket ticket = getTicketById(ticketId);

        // Check max 3 attachments
        long currentCount = attachmentRepository.countByTicketId(ticketId);
        if (currentCount + files.length > 3) {
            throw new RuntimeException("Maximum 3 attachments allowed per ticket. Current: " + currentCount);
        }

        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        List<TicketAttachment> savedAttachments = new ArrayList<>();

        for (MultipartFile file : files) {
            // Generate unique filename
            String originalName = file.getOriginalFilename();
            String extension = originalName != null && originalName.contains(".")
                    ? originalName.substring(originalName.lastIndexOf("."))
                    : "";
            String storedName = UUID.randomUUID().toString() + extension;

            // Save file to disk
            Path filePath = uploadPath.resolve(storedName);
            Files.write(filePath, file.getBytes());

            // Save attachment record
            TicketAttachment attachment = TicketAttachment.builder()
                    .ticket(ticket)
                    .fileName(originalName)
                    .filePath(filePath.toString())
                    .fileType(file.getContentType())
                    .fileSize(file.getSize())
                    .build();

            savedAttachments.add(attachmentRepository.save(attachment));
        }

        return savedAttachments;
    }

    // ─── GET ATTACHMENTS ──────────────────────────────────────────────
    public List<TicketAttachment> getAttachments(Long ticketId) {
        return attachmentRepository.findByTicketId(ticketId);
    }

    // ─── GET ALL TECHNICIANS ──────────────────────────────────────────
    public List<User> getAllTechnicians() {
        return userRepository.findByRole(Role.TECHNICIAN);
    }

    // ─── VALIDATE STATUS TRANSITION ──────────────────────────────────
    private void validateStatusTransition(TicketStatus current, TicketStatus next) {
        boolean valid = switch (current) {
            case OPEN -> next == TicketStatus.IN_PROGRESS || next == TicketStatus.REJECTED;
            case IN_PROGRESS -> next == TicketStatus.RESOLVED;
            case RESOLVED -> next == TicketStatus.CLOSED;
            default -> false;
        };

        if (!valid) {
            throw new RuntimeException(
                    "Invalid status transition: " + current + " → " + next);
        }
    }
}
